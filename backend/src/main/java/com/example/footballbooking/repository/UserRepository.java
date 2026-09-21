package com.example.footballbooking.repository;

import com.example.footballbooking.entity.User;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByRoleAndStatus(UserRole role, UserStatus status);
    Page<User> findByRole(UserRole role, Pageable pageable);
    Page<User> findByRoleAndStatus(UserRole role, UserStatus status, Pageable pageable);
    long countByRole(UserRole role);
    long countByRoleAndStatus(UserRole role, UserStatus status);
}
