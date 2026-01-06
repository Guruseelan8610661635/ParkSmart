package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.model.Analytics;
import com.smartparking.repository.AnalyticsRepository;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    public Analytics createAnalytics(Analytics analytics) {
        analytics.setRecordedAt(LocalDateTime.now());
        return analyticsRepository.save(analytics);
    }

    public List<Analytics> getLocationAnalytics(Long locationId) {
        return analyticsRepository.findByLocationId(locationId);
    }

    public List<Analytics> getAnalyticsByDateRange(Long locationId, LocalDateTime startDate, LocalDateTime endDate) {
        return analyticsRepository.findByLocationAndDateRange(locationId, startDate, endDate);
    }

    public List<Analytics> getTopPerformingDays(LocalDateTime startDate, LocalDateTime endDate) {
        return analyticsRepository.findTopPerformingDays(startDate, endDate);
    }

    public Analytics getLatestAnalytics(Long locationId) {
        List<Analytics> analytics = analyticsRepository.findByLocationId(locationId);
        return analytics.isEmpty() ? null : analytics.get(analytics.size() - 1);
    }
}
