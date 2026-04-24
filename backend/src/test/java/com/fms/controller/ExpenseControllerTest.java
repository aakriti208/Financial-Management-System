package com.fms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fms.dto.ExpenseDTO;
import com.fms.model.ExpenseType;
import com.fms.model.Necessity;
import com.fms.service.ExpenseService;
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

@WebMvcTest(ExpenseController.class)
class ExpenseControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean ExpenseService expenseService;

    private static final String EMAIL = "jane@university.edu";
    private UsernamePasswordAuthenticationToken auth;
    private ExpenseDTO sampleDTO;

    @BeforeEach
    void setUp() {
        auth = new UsernamePasswordAuthenticationToken(EMAIL, null, Collections.emptyList());

        sampleDTO = new ExpenseDTO();
        sampleDTO.setId(1L);
        sampleDTO.setAmount(new BigDecimal("500.00"));
        sampleDTO.setCategory("Rent");
        sampleDTO.setExpenseType(ExpenseType.FIXED);
        sampleDTO.setNecessity(Necessity.ESSENTIAL);
        sampleDTO.setDate(LocalDate.of(2026, 4, 1));
        sampleDTO.setDescription("Monthly rent");
    }

    // ── GET / ─────────────────────────────────────────────────────────────────

    @Test
    void getAll_returnsOkWithList() throws Exception {
        when(expenseService.getAllByUser(EMAIL)).thenReturn(List.of(sampleDTO));

        mockMvc.perform(get("/api/expense").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].category").value("Rent"))
                .andExpect(jsonPath("$[0].amount").value(500.00));
    }

    @Test
    void getAll_returnsEmptyListWhenNoRecords() throws Exception {
        when(expenseService.getAllByUser(EMAIL)).thenReturn(List.of());

        mockMvc.perform(get("/api/expense").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getAll_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/expense"))
                .andExpect(status().isUnauthorized());
    }

    // ── POST / ────────────────────────────────────────────────────────────────

    @Test
    void add_returnsCreatedWithSavedDTO() throws Exception {
        when(expenseService.add(eq(EMAIL), any(ExpenseDTO.class))).thenReturn(sampleDTO);

        mockMvc.perform(post("/api/expense")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category").value("Rent"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void add_returns400WhenAmountMissing() throws Exception {
        ExpenseDTO invalid = new ExpenseDTO();
        invalid.setCategory("Groceries");
        invalid.setExpenseType(ExpenseType.VARIABLE);
        invalid.setNecessity(Necessity.ESSENTIAL);
        invalid.setDate(LocalDate.of(2026, 4, 1));

        mockMvc.perform(post("/api/expense")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void add_returns400WhenCategoryBlank() throws Exception {
        ExpenseDTO invalid = new ExpenseDTO();
        invalid.setAmount(new BigDecimal("50.00"));
        invalid.setCategory("");
        invalid.setExpenseType(ExpenseType.VARIABLE);
        invalid.setNecessity(Necessity.DISCRETIONARY);
        invalid.setDate(LocalDate.of(2026, 4, 1));

        mockMvc.perform(post("/api/expense")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    // ── PUT /{id} ─────────────────────────────────────────────────────────────

    @Test
    void update_returnsOkWithUpdatedDTO() throws Exception {
        ExpenseDTO updatedDTO = new ExpenseDTO();
        updatedDTO.setId(1L);
        updatedDTO.setAmount(new BigDecimal("650.00"));
        updatedDTO.setCategory("Utilities");
        updatedDTO.setExpenseType(ExpenseType.VARIABLE);
        updatedDTO.setNecessity(Necessity.ESSENTIAL);
        updatedDTO.setDate(LocalDate.of(2026, 5, 1));

        when(expenseService.update(eq(1L), any(ExpenseDTO.class))).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/expense/1")
                        .with(authentication(auth)).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.category").value("Utilities"))
                .andExpect(jsonPath("$.amount").value(650.00));
    }

    // ── DELETE /{id} ──────────────────────────────────────────────────────────

    @Test
    void delete_returnsNoContent() throws Exception {
        doNothing().when(expenseService).delete(1L);

        mockMvc.perform(delete("/api/expense/1").with(authentication(auth)).with(csrf()))
                .andExpect(status().isNoContent());

        verify(expenseService).delete(1L);
    }
}
