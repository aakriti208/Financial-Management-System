package com.fms;

import com.fms.controller.IncomeController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fms.dto.IncomeDTO;
import com.fms.model.IncomeSourceType;
import com.fms.service.IncomeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IncomeController.class)
class IncomeControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean IncomeService incomeService;

    private static final String EMAIL = "jane@university.edu";
    private UsernamePasswordAuthenticationToken auth;
    private IncomeDTO sampleDTO;

    @BeforeEach
    void setUp() {
        // authentication() post processor sets the security context directly;
        // no Authorization header is sent so the JWT filter passes through.
        auth = new UsernamePasswordAuthenticationToken(EMAIL, null, Collections.emptyList());

        sampleDTO = new IncomeDTO();
        sampleDTO.setId(1L);
        sampleDTO.setAmount(new BigDecimal("1500.00"));
        sampleDTO.setSource("Scholarship");
        sampleDTO.setSourceType(IncomeSourceType.SCHOLARSHIP);
        sampleDTO.setDate(LocalDate.of(2026, 4, 1));
        sampleDTO.setDescription("Monthly stipend");
    }

    // ── GET / ─────────────────────────────────────────────────────────────────

    @Test
    void getAll_returnsOkWithList() throws Exception {
        when(incomeService.getAllByUser(EMAIL)).thenReturn(List.of(sampleDTO));

        mockMvc.perform(get("/api/income").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].source").value("Scholarship"))
                .andExpect(jsonPath("$[0].amount").value(1500.00));
    }

    @Test
    void getAll_returnsEmptyListWhenNoRecords() throws Exception {
        when(incomeService.getAllByUser(EMAIL)).thenReturn(List.of());

        mockMvc.perform(get("/api/income").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getAll_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/income"))
                .andExpect(status().isUnauthorized());
    }

    // ── POST / ────────────────────────────────────────────────────────────────

    @Test
    void add_returnsCreatedWithSavedDTO() throws Exception {
        when(incomeService.add(eq(EMAIL), any(IncomeDTO.class))).thenReturn(sampleDTO);

        mockMvc.perform(post("/api/income")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.source").value("Scholarship"))
                .andExpect(jsonPath("$.id").value(1));
    }

    // ── PUT /{id} ─────────────────────────────────────────────────────────────

    @Test
    void update_returnsOkWithUpdatedDTO() throws Exception {
        IncomeDTO updatedDTO = new IncomeDTO();
        updatedDTO.setId(1L);
        updatedDTO.setAmount(new BigDecimal("2000.00"));
        updatedDTO.setSource("Assistantship");
        updatedDTO.setSourceType(IncomeSourceType.ASSISTANTSHIP);
        updatedDTO.setDate(LocalDate.of(2026, 5, 1));

        when(incomeService.update(eq(1L), any(IncomeDTO.class))).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/income/1")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.source").value("Assistantship"))
                .andExpect(jsonPath("$.amount").value(2000.00));
    }

    // ── DELETE /{id} ──────────────────────────────────────────────────────────

    @Test
    void delete_returnsNoContent() throws Exception {
        doNothing().when(incomeService).delete(1L);

        mockMvc.perform(delete("/api/income/1").with(authentication(auth)).with(csrf()))
                .andExpect(status().isNoContent());

        verify(incomeService).delete(1L);
    }
}
