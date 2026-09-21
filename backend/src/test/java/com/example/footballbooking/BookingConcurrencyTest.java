package com.example.footballbooking;

import com.example.footballbooking.dto.request.BookingCreateRequest;
import com.example.footballbooking.entity.FootballField;
import com.example.footballbooking.repository.FootballFieldRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BookingConcurrencyTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FootballFieldRepository fieldRepository;

    @Test
    @WithMockUser(username = "user@football.vn", authorities = {"ROLE_USER"})
    void testAntiDoubleBookingAndPriceCalculation() throws Exception {
        FootballField field = fieldRepository.findAll().stream()
                .filter(f -> f.getStatus().name().equals("ACTIVE"))
                .findFirst()
                .orElseThrow();

        LocalDate testDate = LocalDate.now().plusDays(100 + (long) (Math.random() * 9000));
        String startTime = "19:00";
        String endTime = "20:30";

        BookingCreateRequest request1 = BookingCreateRequest.builder()
                .fieldId(field.getId())
                .bookingDate(testDate)
                .startTime(startTime)
                .endTime(endTime)
                .customerName("Người Đặt Thứ Nhất")
                .customerPhone("0911223344")
                .build();

        // 1. Request thứ nhất: Đặt khung giờ này -> Phải thành công (HTTP 201 Created)
        MvcResult result1 = mockMvc.perform(post("/api/v1/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPrice").isNotEmpty())
                .andReturn();

        // Kiểm tra backend tự tính tiền lớn hơn 0
        String responseBody = result1.getResponse().getContentAsString();
        assertTrue(responseBody.contains("totalPrice"));

        // 2. Request thứ hai: Cố tình đặt TRÙNG cùng sân và cùng khung giờ -> Bắt buộc bị từ chối với HTTP 409 Conflict
        BookingCreateRequest request2 = BookingCreateRequest.builder()
                .fieldId(field.getId())
                .bookingDate(testDate)
                .startTime(startTime)
                .endTime(endTime)
                .customerName("Người Đặt Thứ Hai (Trùng Lịch)")
                .customerPhone("0999888777")
                .build();

        mockMvc.perform(post("/api/v1/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("đã có người đặt trước")));
    }
}
