package com.smartparking.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.FeedbackRequest;
import com.smartparking.model.Feedback;
import com.smartparking.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback submitFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback(
                request.getUserId(),
                request.getBookingId(),
                request.getRating(),
                request.getComment(),
                request.getCategory()
        );
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getUserFeedback(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public List<Feedback> getBookingFeedback(Long bookingId) {
        return feedbackRepository.findByBookingId(bookingId);
    }

    public List<Feedback> getFeedbackByCategory(String category) {
        return feedbackRepository.findByCategory(category);
    }

    public Double getAverageRatingByCategory(String category) {
        return feedbackRepository.getAverageRatingByCategory(category);
    }

    public Double getOverallAverageRating() {
        return feedbackRepository.getOverallAverageRating();
    }

    public Map<String, Object> getFeedbackStatistics() {
        double overallRating = feedbackRepository.getOverallAverageRating() != null ? 
                               feedbackRepository.getOverallAverageRating() : 0.0;
        
        return Map.of(
                "overallRating", overallRating,
                "totalFeedback", feedbackRepository.count(),
                "facilityCategoryRating", feedbackRepository.getAverageRatingByCategory("FACILITY") != null ? 
                                          feedbackRepository.getAverageRatingByCategory("FACILITY") : 0.0,
                "serviceRating", feedbackRepository.getAverageRatingByCategory("SERVICE") != null ? 
                                 feedbackRepository.getAverageRatingByCategory("SERVICE") : 0.0,
                "pricingRating", feedbackRepository.getAverageRatingByCategory("PRICING") != null ? 
                                 feedbackRepository.getAverageRatingByCategory("PRICING") : 0.0
        );
    }
}
