package com.smartparking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String planType; // MONTHLY, QUARTERLY, ANNUAL
    private Double monthlyAmount;
    private Boolean isActive = true;
    private Integer remainingSlots;
    private String status; // ACTIVE, EXPIRED, CANCELLED

    public UserSubscription() {}

    public UserSubscription(Long userId, String planType, Double monthlyAmount, Integer remainingSlots) {
        this.userId = userId;
        this.planType = planType;
        this.monthlyAmount = monthlyAmount;
        this.remainingSlots = remainingSlots;
        this.isActive = true;
        this.status = "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public Double getMonthlyAmount() { return monthlyAmount; }
    public void setMonthlyAmount(Double monthlyAmount) { this.monthlyAmount = monthlyAmount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getRemainingSlots() { return remainingSlots; }
    public void setRemainingSlots(Integer remainingSlots) { this.remainingSlots = remainingSlots; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
