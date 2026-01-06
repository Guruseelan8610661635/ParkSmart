package com.smartparking.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.BookingDetailDto;

@Service
public class BookingCacheService {

    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private static final long CACHE_DURATION_MS = 60000; // 1 minute

    @Autowired
    private BookingHistoryService bookingHistoryService;

    public List<BookingDetailDto> getRecentBookingsFromCache(Long userId, int limit) {
        String cacheKey = "recent_" + userId + "_" + limit;
        CacheEntry entry = cache.get(cacheKey);

        if (entry != null && !isExpired(entry)) {
            return entry.getData();
        }

        List<BookingDetailDto> data = bookingHistoryService.getQuickBookingList(userId, limit);
        cache.put(cacheKey, new CacheEntry(data, System.currentTimeMillis()));

        return data;
    }

    public void clearCache(Long userId) {
        cache.keySet().removeIf(key -> key.contains("_" + userId + "_"));
    }

    public void clearAllCache() {
        cache.clear();
    }

    private boolean isExpired(CacheEntry entry) {
        return System.currentTimeMillis() - entry.getTimestamp() > CACHE_DURATION_MS;
    }

    private static class CacheEntry {
        private final List<BookingDetailDto> data;
        private final long timestamp;

        public CacheEntry(List<BookingDetailDto> data, long timestamp) {
            this.data = data;
            this.timestamp = timestamp;
        }

        public List<BookingDetailDto> getData() {
            return data;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}
