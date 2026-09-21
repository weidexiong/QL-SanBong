package com.example.footballbooking.repository;

import com.example.footballbooking.entity.FieldTimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FieldTimeSlotRepository extends JpaRepository<FieldTimeSlot, Long> {
    List<FieldTimeSlot> findByFieldIdAndIsActiveTrueOrderByStartTimeAsc(Long fieldId);
    List<FieldTimeSlot> findByFieldIdOrderByStartTimeAsc(Long fieldId);
    Optional<FieldTimeSlot> findByFieldIdAndStartTimeAndEndTime(Long fieldId, String startTime, String endTime);
}
