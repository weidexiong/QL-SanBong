package com.example.footballbooking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardAndAdminTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "chusan@football.vn", authorities = {"ROLE_CHUSAN"})
    void testOwnerStatsSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/owner/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalFields").isNumber())
                .andExpect(jsonPath("$.data.todayBookings").isNumber());
    }

    @Test
    @WithMockUser(username = "admin@football.vn", authorities = {"ROLE_ADMIN"})
    void testAdminStatsSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers").isNumber())
                .andExpect(jsonPath("$.data.totalBookings").isNumber());
    }

    @Test
    @WithMockUser(username = "user@football.vn", authorities = {"ROLE_USER"})
    void testUserForbiddenFromOwnerAndAdminApis() throws Exception {
        // User bình thường không được phép vào API của Chủ sân
        mockMvc.perform(get("/api/v1/owner/dashboard/stats"))
                .andExpect(status().isForbidden());

        // User bình thường không được phép vào API của Admin
        mockMvc.perform(get("/api/v1/admin/dashboard/stats"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@football.vn", authorities = {"ROLE_ADMIN"})
    void testAdminGetUsersList() throws Exception {
        mockMvc.perform(get("/api/v1/admin/users")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }
}
