package com.fms.service;

import com.fms.dto.ExpenseDTO;

import java.util.List;

public interface ExpenseService {

    List<ExpenseDTO> getAllByUser(String userEmail);

    ExpenseDTO add(String userEmail, ExpenseDTO dto);

    ExpenseDTO update(Long id, ExpenseDTO dto);

    void delete(Long id);
}
