package com.example.footballbooking.repository;

import com.example.footballbooking.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingId(Long bookingId);

    Page<Review> findByFieldIdOrderByCreatedAtDesc(Long fieldId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.field.id = :fieldId")
    Double calculateAverageRatingByFieldId(@Param("fieldId") Long fieldId);

    long countByFieldId(Long fieldId);
}
