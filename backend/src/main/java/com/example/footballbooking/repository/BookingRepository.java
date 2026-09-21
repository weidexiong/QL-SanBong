package com.example.footballbooking.repository;

import com.example.footballbooking.entity.Booking;
import com.example.footballbooking.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.field.owner.id = :ownerId ORDER BY b.createdAt DESC")
    Page<Booking> findByOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.field.owner.id = :ownerId AND b.bookingDate = :date ORDER BY b.startTime ASC")
    List<Booking> findByOwnerIdAndDate(@Param("ownerId") Long ownerId, @Param("date") LocalDate date);

    List<Booking> findByFieldIdAndBookingDateAndStatusIn(
            Long fieldId, LocalDate bookingDate, Collection<BookingStatus> statuses
    );

    // Kiểm tra trực tiếp tại Database xem slot đã bị chiếm hay chưa (Chống Double Booking)
    boolean existsByFieldIdAndBookingDateAndStartTimeAndStatusIn(
            Long fieldId,
            LocalDate bookingDate,
            String startTime,
            Collection<BookingStatus> statuses
    );

    long countByStatus(BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.field.owner.id = :ownerId AND b.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") BookingStatus status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.field.owner.id = :ownerId AND b.bookingDate = :date")
    long countByOwnerIdAndDate(@Param("ownerId") Long ownerId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.field.owner.id = :ownerId AND b.status = 'COMPLETED' AND b.bookingDate = :date")
    Long calculateTodayRevenueByOwner(@Param("ownerId") Long ownerId, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.field.owner.id = :ownerId AND b.status = 'COMPLETED' AND b.bookingDate BETWEEN :startDate AND :endDate")
    Long calculateMonthRevenueByOwner(@Param("ownerId") Long ownerId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status = 'COMPLETED'")
    Long calculateTotalSystemRevenue();
}
