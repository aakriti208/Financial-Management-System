package com.fms.service;

import com.fms.dto.ExpenseDTO;
import com.fms.model.Expense;
import com.fms.model.User;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// EmbeddingService is injected for async vector indexing on save/update

/**
 * Default implementation of {@link ExpenseService} providing CRUD operations
 * for a user's expense records.
 *
 * <p>Expenses are classified by {@link com.fms.model.ExpenseType} (FIXED or VARIABLE)
 * and {@link com.fms.model.Necessity} (ESSENTIAL or DISCRETIONARY) to support
 * budget analysis and prediction features.</p>
 */
@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final EmbeddingService embeddingService;

    /**
     * Returns all expense records for the given user, ordered by date descending.
     *
     * @param userEmail the authenticated user's email
     * @return list of {@link ExpenseDTO}s, newest first; empty list if none exist
     * @throws RuntimeException if no user is found for the given email
     */
    @Override
    public List<ExpenseDTO> getAllByUser(String userEmail) {
        User user = getUser(userEmail);
        return expenseRepository.findByUserOrderByDateDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Creates and persists a new expense record for the given user.
     *
     * @param userEmail the authenticated user's email
     * @param dto       expense data to save
     * @return the saved record as an {@link ExpenseDTO} with its generated id
     * @throws RuntimeException if no user is found for the given email
     */
    @Override
    public ExpenseDTO add(String userEmail, ExpenseDTO dto) {
        User user = getUser(userEmail);
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setExpenseType(dto.getExpenseType());
        expense.setNecessity(dto.getNecessity());
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());
        ExpenseDTO saved = toDTO(expenseRepository.save(expense));
        embeddingService.embedExpenseAsync(saved.getId(), toEmbeddingText(dto));
        return saved;
    }

    /**
     * Updates an existing expense record with the provided data.
     *
     * @param id  the id of the expense record to update
     * @param dto new field values to apply
     * @return the updated record as an {@link ExpenseDTO}
     * @throws RuntimeException if no expense record exists with the given id
     */
    @Override
    public ExpenseDTO update(Long id, ExpenseDTO dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense record not found"));
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        expense.setExpenseType(dto.getExpenseType());
        expense.setNecessity(dto.getNecessity());
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());
        ExpenseDTO updated = toDTO(expenseRepository.save(expense));
        embeddingService.embedExpenseAsync(updated.getId(), toEmbeddingText(dto));
        return updated;
    }

    /**
     * Deletes the expense record with the given id.
     *
     * @param id the id of the expense record to delete
     * @throws RuntimeException if no expense record exists with the given id
     */
    @Override
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense record not found");
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseDTO toDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setExpenseType(expense.getExpenseType());
        dto.setNecessity(expense.getNecessity());
        dto.setDate(expense.getDate());
        dto.setDescription(expense.getDescription());
        return dto;
    }

    private String toEmbeddingText(ExpenseDTO dto) {
        return String.format("Expense: %s $%s | Type: %s | Necessity: %s | Date: %s",
                dto.getCategory(), dto.getAmount(),
                dto.getExpenseType(), dto.getNecessity(), dto.getDate());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
