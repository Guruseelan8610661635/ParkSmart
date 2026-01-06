package com.smartparking.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartparking.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    List<Notification> findUnreadNotificationsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false")
    long countUnreadNotifications(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
