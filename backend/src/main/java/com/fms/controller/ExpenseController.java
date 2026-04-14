package com.fms.controller;

import com.fms.dto.ExpenseDTO;
import com.fms.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAll(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(expenseService.getAllByUser(email));
    }

    @PostMapping
    public ResponseEntity<ExpenseDTO> add(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ExpenseDTO dto) {
        return ResponseEntity.status(201).body(expenseService.add(email, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDTO dto) {
        return ResponseEntity.ok(expenseService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
