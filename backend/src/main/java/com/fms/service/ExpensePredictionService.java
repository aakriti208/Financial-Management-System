package com.fms.service;

import com.fms.dto.ExpenseDTO;

import java.util.List;

public interface ExpensePredictionService {

    List<ExpenseDTO> predictNextMonthExpenses(String userEmail);
}
