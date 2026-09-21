package com.example.footballbooking.repository;

import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.entity.FootballField;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FootballFieldRepository extends JpaRepository<FootballField, Long>, JpaSpecificationExecutor<FootballField> {

    Page<FootballField> findByStatus(FieldStatus status, Pageable pageable);

    List<FootballField> findByOwnerId(Long ownerId);

    Page<FootballField> findByOwnerId(Long ownerId, Pageable pageable);

    long countByStatus(FieldStatus status);

    long countByOwnerId(Long ownerId);
}
