package com.fms;

import com.fms.service.ExpenseServiceImpl;

import com.fms.dto.ExpenseDTO;
import com.fms.model.*;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceImplTest {

    @Mock ExpenseRepository expenseRepository;
    @Mock UserRepository userRepository;

    @InjectMocks ExpenseServiceImpl expenseService;

    private User user;
    private Expense expense;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("jane@university.edu");
        user.setFirstName("Jane");
        user.setLastName("Doe");

        expense = new Expense();
        expense.setId(1L);
        expense.setUser(user);
        expense.setAmount(new BigDecimal("500.00"));
        expense.setCategory("Rent");
        expense.setExpenseType(ExpenseType.FIXED);
        expense.setNecessity(Necessity.ESSENTIAL);
        expense.setDate(LocalDate.of(2026, 4, 1));
        expense.setDescription("Monthly rent");
    }

    // ── getAllByUser ───────────────────────────────────────────────────────────

    @Test
    void getAllByUser_returnsMappedDTOs() {
        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(expenseRepository.findByUserOrderByDateDesc(user)).thenReturn(List.of(expense));

        List<ExpenseDTO> result = expenseService.getAllByUser("jane@university.edu");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory()).isEqualTo("Rent");
        assertThat(result.get(0).getAmount()).isEqualByComparingTo("500.00");
        assertThat(result.get(0).getExpenseType()).isEqualTo(ExpenseType.FIXED);
        assertThat(result.get(0).getNecessity()).isEqualTo(Necessity.ESSENTIAL);
    }

    @Test
    void getAllByUser_returnsEmptyListWhenNoRecords() {
        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(expenseRepository.findByUserOrderByDateDesc(user)).thenReturn(List.of());

        List<ExpenseDTO> result = expenseService.getAllByUser("jane@university.edu");

        assertThat(result).isEmpty();
    }

    @Test
    void getAllByUser_throwsWhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.getAllByUser("unknown@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    // ── add ───────────────────────────────────────────────────────────────────

    @Test
    void add_savesAndReturnsMappedDTO() {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setAmount(new BigDecimal("500.00"));
        dto.setCategory("Rent");
        dto.setExpenseType(ExpenseType.FIXED);
        dto.setNecessity(Necessity.ESSENTIAL);
        dto.setDate(LocalDate.of(2026, 4, 1));
        dto.setDescription("Monthly rent");

        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        ExpenseDTO result = expenseService.add("jane@university.edu", dto);

        assertThat(result.getCategory()).isEqualTo("Rent");
        assertThat(result.getId()).isEqualTo(1L);
        verify(expenseRepository).save(any(Expense.class));
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    void update_modifiesFieldsAndSaves() {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setAmount(new BigDecimal("600.00"));
        dto.setCategory("Updated Rent");
        dto.setExpenseType(ExpenseType.FIXED);
        dto.setNecessity(Necessity.ESSENTIAL);
        dto.setDate(LocalDate.of(2026, 5, 1));

        Expense updated = new Expense();
        updated.setId(1L);
        updated.setUser(user);
        updated.setAmount(new BigDecimal("600.00"));
        updated.setCategory("Updated Rent");
        updated.setExpenseType(ExpenseType.FIXED);
        updated.setNecessity(Necessity.ESSENTIAL);
        updated.setDate(LocalDate.of(2026, 5, 1));

        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(updated);

        ExpenseDTO result = expenseService.update(1L, dto);

        assertThat(result.getAmount()).isEqualByComparingTo("600.00");
        assertThat(result.getCategory()).isEqualTo("Updated Rent");
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void update_throwsWhenRecordNotFound() {
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.update(99L, new ExpenseDTO()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Expense record not found");
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_callsDeleteById() {
        when(expenseRepository.existsById(1L)).thenReturn(true);

        expenseService.delete(1L);

        verify(expenseRepository).deleteById(1L);
    }

    @Test
    void delete_throwsWhenRecordNotFound() {
        when(expenseRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> expenseService.delete(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Expense record not found");

        verify(expenseRepository, never()).deleteById(any());
    }
}
