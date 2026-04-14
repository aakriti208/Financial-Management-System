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

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public List<ExpenseDTO> getAllByUser(String userEmail) {
        User user = getUser(userEmail);
        return expenseRepository.findByUserOrderByDateDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

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
        return toDTO(expenseRepository.save(expense));
    }

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
        return toDTO(expenseRepository.save(expense));
    }

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

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
