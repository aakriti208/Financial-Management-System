package com.fms;

import com.fms.service.IncomeServiceImpl;

import com.fms.dto.IncomeDTO;
import com.fms.model.Income;
import com.fms.model.IncomeSourceType;
import com.fms.model.User;
import com.fms.repository.IncomeRepository;
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
class IncomeServiceImplTest {

    @Mock IncomeRepository incomeRepository;
    @Mock UserRepository userRepository;

    @InjectMocks IncomeServiceImpl incomeService;

    private User user;
    private Income income;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("jane@university.edu");
        user.setFirstName("Jane");
        user.setLastName("Doe");

        income = new Income();
        income.setId(1L);
        income.setUser(user);
        income.setAmount(new BigDecimal("1500.00"));
        income.setSource("NSF Fellowship");
        income.setSourceType(IncomeSourceType.SCHOLARSHIP);
        income.setDate(LocalDate.of(2026, 4, 1));
        income.setDescription("Monthly stipend");
    }

    // ── getAllByUser ───────────────────────────────────────────────────────────

    @Test
    void getAllByUser_returnsMappedDTOs() {
        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(incomeRepository.findByUserOrderByDateDesc(user)).thenReturn(List.of(income));

        List<IncomeDTO> result = incomeService.getAllByUser("jane@university.edu");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSource()).isEqualTo("NSF Fellowship");
        assertThat(result.get(0).getAmount()).isEqualByComparingTo("1500.00");
        assertThat(result.get(0).getSourceType()).isEqualTo(IncomeSourceType.SCHOLARSHIP);
    }

    @Test
    void getAllByUser_returnsEmptyListWhenNoRecords() {
        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(incomeRepository.findByUserOrderByDateDesc(user)).thenReturn(List.of());

        List<IncomeDTO> result = incomeService.getAllByUser("jane@university.edu");

        assertThat(result).isEmpty();
    }

    // ── add ───────────────────────────────────────────────────────────────────

    @Test
    void add_savesAndReturnsMappedDTO() {
        IncomeDTO dto = new IncomeDTO();
        dto.setAmount(new BigDecimal("1500.00"));
        dto.setSource("NSF Fellowship");
        dto.setSourceType(IncomeSourceType.SCHOLARSHIP);
        dto.setDate(LocalDate.of(2026, 4, 1));
        dto.setDescription("Monthly stipend");

        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(incomeRepository.save(any(Income.class))).thenReturn(income);

        IncomeDTO result = incomeService.add("jane@university.edu", dto);

        assertThat(result.getSource()).isEqualTo("NSF Fellowship");
        assertThat(result.getId()).isEqualTo(1L);
        verify(incomeRepository).save(any(Income.class));
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    void update_modifiesFieldsAndSaves() {
        IncomeDTO dto = new IncomeDTO();
        dto.setAmount(new BigDecimal("2000.00"));
        dto.setSource("Updated Source");
        dto.setSourceType(IncomeSourceType.ASSISTANTSHIP);
        dto.setDate(LocalDate.of(2026, 5, 1));

        Income updated = new Income();
        updated.setId(1L);
        updated.setUser(user);
        updated.setAmount(new BigDecimal("2000.00"));
        updated.setSource("Updated Source");
        updated.setSourceType(IncomeSourceType.ASSISTANTSHIP);
        updated.setDate(LocalDate.of(2026, 5, 1));

        when(incomeRepository.findById(1L)).thenReturn(Optional.of(income));
        when(incomeRepository.save(any(Income.class))).thenReturn(updated);

        IncomeDTO result = incomeService.update(1L, dto);

        assertThat(result.getAmount()).isEqualByComparingTo("2000.00");
        assertThat(result.getSource()).isEqualTo("Updated Source");
        verify(incomeRepository).save(any(Income.class));
    }

    @Test
    void update_throwsWhenRecordNotFound() {
        when(incomeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> incomeService.update(99L, new IncomeDTO()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Income record not found");
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_callsDeleteById() {
        when(incomeRepository.existsById(1L)).thenReturn(true);

        incomeService.delete(1L);

        verify(incomeRepository).deleteById(1L);
    }

    @Test
    void delete_throwsWhenRecordNotFound() {
        when(incomeRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> incomeService.delete(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Income record not found");

        verify(incomeRepository, never()).deleteById(any());
    }
}
