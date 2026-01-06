package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.PromotionRequest;
import com.smartparking.model.Promotion;
import com.smartparking.repository.PromotionRepository;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    public Promotion createPromotion(PromotionRequest request) {
        Promotion promotion = new Promotion(
                request.getCode(),
                request.getDiscountPercentage(),
                request.getUsageLimit()
        );
        promotion.setDescription(request.getDescription());
        return promotionRepository.save(promotion);
    }

    public Promotion updatePromotion(Long promotionId, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        
        promotion.setCode(request.getCode());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercentage(request.getDiscountPercentage());
        promotion.setUsageLimit(request.getUsageLimit());
        promotion.setStatus(request.getStatus());
        
        return promotionRepository.save(promotion);
    }

    public Promotion validateAndGetPromotion(String code) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion code not found"));
        
        if (!promotion.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Promotion is not active");
        }
        
        if (promotion.getExpiresAt() != null && promotion.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Promotion has expired");
        }
        
        if (promotion.getUsageLimit() != null && promotion.getTimesUsed() >= promotion.getUsageLimit()) {
            throw new RuntimeException("Promotion usage limit reached");
        }
        
        return promotion;
    }

    public void usePromotion(String code) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        
        promotion.setTimesUsed(promotion.getTimesUsed() + 1);
        promotionRepository.save(promotion);
    }

    public List<Promotion> getActivePromotions() {
        return promotionRepository.findActivePromotions();
    }

    public Promotion getPromotionByCode(String code) {
        return promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
    }

    public List<Promotion> getPromotionsByStatus(String status) {
        return promotionRepository.findByStatus(status);
    }

    public void deletePromotion(Long promotionId) {
        promotionRepository.deleteById(promotionId);
    }
}
