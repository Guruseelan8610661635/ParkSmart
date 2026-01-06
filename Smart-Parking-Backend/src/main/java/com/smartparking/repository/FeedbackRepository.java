package com.smartparking.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartparking.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUserId(Long userId);
    List<Feedback> findByBookingId(Long bookingId);
    List<Feedback> findByCategory(String category);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.category = :category")
    Double getAverageRatingByCategory(@Param("category") String category);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getOverallAverageRating();
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.rating >= :rating")
    long countFeedbackWithRating(@Param("rating") Integer rating);
}
