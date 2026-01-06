package com.smartparking.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartparking.model.UserSubscription;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    Optional<UserSubscription> findByUserId(Long userId);
}
