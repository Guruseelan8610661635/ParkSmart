package com.smartparking.dto;

public class FeedbackRequest {
    private Long userId;
    private Long bookingId;
    private Integer rating; // 1-5
    private String comment;
    private String category; // FACILITY, SERVICE, PRICING, CLEANLINESS, SAFETY

    public FeedbackRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
