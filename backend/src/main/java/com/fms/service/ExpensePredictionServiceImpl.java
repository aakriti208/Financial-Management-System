package com.fms.service;

import com.fms.dto.ExpenseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpensePredictionServiceImpl implements ExpensePredictionService {

    @Override
    public List<ExpenseDTO> predictNextMonthExpenses(String userEmail) {
        // TODO: Fetch last 3-6 months of expenses for the user
        // TODO: Group expenses by category
        // TODO: Apply moving-average or trend-based prediction per category
        // TODO: Return list of predicted ExpenseDTOs for next month
        return null;
    }
}
