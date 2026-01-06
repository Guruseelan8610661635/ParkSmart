package com.smartparking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.smartparking.model.Slot;

public interface SlotRepository extends JpaRepository<Slot, Long> {
	List<Slot> findByLocationId(Long locationId);
	
	@Query("SELECT s FROM Slot s JOIN FETCH s.location")
	List<Slot> findAllWithLocation();
}
