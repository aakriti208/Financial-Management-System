package com.fms.service;

import com.fms.dto.IncomeDTO;
import com.fms.model.Income;
import com.fms.model.User;
import com.fms.repository.IncomeRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link IncomeService} providing CRUD operations
 * for a user's income records.
 *
 * <p>All write operations resolve the owning {@link com.fms.model.User} by
 * email before persisting, ensuring that records are always associated with
 * the authenticated user.</p>
 */
@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    /**
     * Returns all income records for the given user, ordered by date descending.
     *
     * @param userEmail the authenticated user's email
     * @return list of {@link IncomeDTO}s, newest first; empty list if none exist
     * @throws RuntimeException if no user is found for the given email
     */
    @Override
    public List<IncomeDTO> getAllByUser(String userEmail) {
        User user = getUser(userEmail);
        return incomeRepository.findByUserOrderByDateDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Creates and persists a new income record for the given user.
     *
     * @param userEmail the authenticated user's email
     * @param dto       income data to save
     * @return the saved record as an {@link IncomeDTO} with its generated id
     * @throws RuntimeException if no user is found for the given email
     */
    @Override
    public IncomeDTO add(String userEmail, IncomeDTO dto) {
        User user = getUser(userEmail);
        Income income = new Income();
        income.setUser(user);
        income.setAmount(dto.getAmount());
        income.setSource(dto.getSource());
        income.setSourceType(dto.getSourceType());
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());
        return toDTO(incomeRepository.save(income));
    }

    /**
     * Updates an existing income record with the provided data.
     *
     * @param id  the id of the income record to update
     * @param dto new field values to apply
     * @return the updated record as an {@link IncomeDTO}
     * @throws RuntimeException if no income record exists with the given id
     */
    @Override
    public IncomeDTO update(Long id, IncomeDTO dto) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found"));
        income.setAmount(dto.getAmount());
        income.setSource(dto.getSource());
        income.setSourceType(dto.getSourceType());
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());
        return toDTO(incomeRepository.save(income));
    }

    /**
     * Deletes the income record with the given id.
     *
     * @param id the id of the income record to delete
     * @throws RuntimeException if no income record exists with the given id
     */
    @Override
    public void delete(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new RuntimeException("Income record not found");
        }
        incomeRepository.deleteById(id);
    }

    private IncomeDTO toDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setSource(income.getSource());
        dto.setSourceType(income.getSourceType());
        dto.setDate(income.getDate());
        dto.setDescription(income.getDescription());
        return dto;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
