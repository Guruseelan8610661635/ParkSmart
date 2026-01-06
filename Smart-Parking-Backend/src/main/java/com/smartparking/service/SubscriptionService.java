package com.smartparking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.model.UserSubscription;
import com.smartparking.repository.UserSubscriptionRepository;

@Service
public class SubscriptionService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    public UserSubscription createSubscription(Long userId, String planType, Double monthlyAmount, Integer slots) {
        UserSubscription subscription = new UserSubscription(userId, planType, monthlyAmount, slots);
        return subscriptionRepository.save(subscription);
    }

    public UserSubscription getUserSubscription(Long userId) {
        return subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found for user"));
    }

    public UserSubscription updateSubscription(Long userId, String planType, Double monthlyAmount, Integer slots) {
        UserSubscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setPlanType(planType);
        subscription.setMonthlyAmount(monthlyAmount);
        subscription.setRemainingSlots(slots);
        
        return subscriptionRepository.save(subscription);
    }

    public void deductSlot(Long userId) {
        UserSubscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (subscription.getRemainingSlots() > 0) {
            subscription.setRemainingSlots(subscription.getRemainingSlots() - 1);
            subscriptionRepository.save(subscription);
        }
    }

    public void cancelSubscription(Long userId) {
        UserSubscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setIsActive(false);
        subscription.setStatus("CANCELLED");
        subscriptionRepository.save(subscription);
    }

    public Boolean hasActiveSubscription(Long userId) {
        return subscriptionRepository.findByUserId(userId)
                .map(UserSubscription::getIsActive)
                .orElse(false);
    }
}
