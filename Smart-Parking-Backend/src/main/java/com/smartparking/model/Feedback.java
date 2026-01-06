package com.smartparking.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long bookingId;
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private String category;
    private LocalDateTime createdAt;

    public Feedback() {}

    public Feedback(Long userId, Long bookingId, Integer rating, String comment, String category) {
        this.userId = userId;
        this.bookingId = bookingId;
        this.rating = rating;
        this.comment = comment;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
