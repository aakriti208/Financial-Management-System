package com.fms.service;

import com.fms.dto.ExpenseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Override
    public List<ExpenseDTO> getAllByUser(String userEmail) {
        // TODO: Fetch User entity by email using UserRepository
        // TODO: Retrieve all Expense records via ExpenseRepository.findByUserOrderByDateDesc()
        // TODO: Map each Expense entity to ExpenseDTO and return list
        return null;
    }

    @Override
    public ExpenseDTO add(String userEmail, ExpenseDTO dto) {
        // TODO: Fetch User entity by email
        // TODO: Map ExpenseDTO to Expense entity, set user
        // TODO: Save via ExpenseRepository.save()
        // TODO: Map saved entity back to ExpenseDTO and return
        return null;
    }

    @Override
    public ExpenseDTO update(Long id, ExpenseDTO dto) {
        // TODO: Fetch existing Expense by id (throw exception if not found)
        // TODO: Update fields: amount, category, date, description
        // TODO: Save updated entity, return mapped ExpenseDTO
        return null;
    }

    @Override
    public void delete(Long id) {
        // TODO: Check expense exists (throw exception if not found)
        // TODO: Call ExpenseRepository.deleteById(id)
    }
}
