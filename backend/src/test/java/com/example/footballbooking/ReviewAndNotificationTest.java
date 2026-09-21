package com.example.footballbooking;

import com.example.footballbooking.dto.request.ReviewCreateRequest;
import com.example.footballbooking.entity.Booking;
import com.example.footballbooking.entity.BookingStatus;
import com.example.footballbooking.entity.FootballField;
import com.example.footballbooking.entity.User;
import com.example.footballbooking.repository.BookingRepository;
import com.example.footballbooking.repository.FootballFieldRepository;
import com.example.footballbooking.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReviewAndNotificationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FootballFieldRepository fieldRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    @WithMockUser(username = "user@football.vn", authorities = {"ROLE_USER"})
    void testCannotReviewIncompleteBooking() throws Exception {
        User user = userRepository.findByEmail("user@football.vn").orElseThrow();
        FootballField field = fieldRepository.findAll().get(0);

        // Tạo 1 booking trạng thái PENDING
        Booking booking = Booking.builder()
                .bookingCode("#BK-TEST-" + System.currentTimeMillis())
                .user(user)
                .field(field)
                .bookingDate(LocalDate.now().plusDays(200))
                .startTime("06:00")
                .endTime("07:30")
                .totalPrice(200000L)
                .status(BookingStatus.PENDING)
                .build();
        booking = bookingRepository.save(booking);

        ReviewCreateRequest request = ReviewCreateRequest.builder()
                .bookingId(booking.getId())
                .rating(5)
                .comment("Sân rất tốt!")
                .build();

        // Không thể đánh giá đơn chưa COMPLETED -> Bắt buộc trả về HTTP 400 Bad Request (Quy tắc 50)
        mockMvc.perform(post("/api/v1/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("BAD_REQUEST"));
    }

    @Test
    @WithMockUser(username = "user@football.vn", authorities = {"ROLE_USER"})
    void testCanGetNotificationUnreadCount() throws Exception {
        mockMvc.perform(get("/api/v1/notifications/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
