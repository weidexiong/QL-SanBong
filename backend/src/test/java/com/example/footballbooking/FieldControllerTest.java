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
class FieldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testSearchActiveFieldsPublic() throws Exception {
        mockMvc.perform(get("/api/v1/fields"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").isNotEmpty());
    }

    @Test
    @WithMockUser(username = "admin@football.vn", authorities = {"ROLE_ADMIN"})
    void testAdminCanGetAllFields() throws Exception {
        mockMvc.perform(get("/api/v1/admin/fields"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @WithMockUser(username = "user@football.vn", authorities = {"ROLE_USER"})
    void testUserCannotAccessAdminFields() throws Exception {
        // Khách hàng không thể truy cập API của Admin (Requirement 9)
        mockMvc.perform(get("/api/v1/admin/fields"))
                .andExpect(status().isForbidden());
    }
}
