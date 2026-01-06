package com.smartparking.dto;

public class PromotionRequest {
    private String code;
    private String description;
    private Double discountPercentage;
    private Integer usageLimit;
    private Integer timesUsed;
    private String status; // ACTIVE, EXPIRED, DISABLED

    public PromotionRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getTimesUsed() { return timesUsed; }
    public void setTimesUsed(Integer timesUsed) { this.timesUsed = timesUsed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
