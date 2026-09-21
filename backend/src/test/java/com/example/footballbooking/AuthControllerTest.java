package com.example.footballbooking;

import com.example.footballbooking.dto.request.LoginRequest;
import com.example.footballbooking.dto.request.RegisterRequest;
import com.example.footballbooking.entity.UserRole;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testLoginSuccessWithAdmin() throws Exception {
        LoginRequest request = new LoginRequest("admin@football.vn", "Admin@123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("admin@football.vn"))
                .andExpect(jsonPath("$.data.user.role").value("ROLE_ADMIN"));
    }

    @Test
    void testLoginFailWithWrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("admin@football.vn", "WrongPassword999");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void testRegisterNewUserSuccess() throws Exception {
        String testEmail = "test_khachhang_" + System.currentTimeMillis() + "@gmail.com";
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Nguyễn Khách Mới")
                .email(testEmail)
                .password("Matkhau@123")
                .phone("0987654321")
                .role(UserRole.ROLE_USER)
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.email").value(testEmail))
                .andExpect(jsonPath("$.data.user.role").value("ROLE_USER"))
                .andExpect(jsonPath("$.data.user.status").value("ACTIVE"));
    }
}
