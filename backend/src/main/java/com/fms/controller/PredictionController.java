package com.fms.controller;

import com.fms.dto.ExpenseDTO;
import com.fms.service.ExpensePredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prediction")
@RequiredArgsConstructor
public class PredictionController {

    private final ExpensePredictionService predictionService;

    // GET /api/prediction/expenses
    @GetMapping("/expenses")
    public ResponseEntity<List<ExpenseDTO>> predictExpenses(
            @AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Call predictionService.predictNextMonthExpenses(userDetails.getUsername())
        // TODO: Return ResponseEntity.ok(predictions)
        return null;
    }
}
