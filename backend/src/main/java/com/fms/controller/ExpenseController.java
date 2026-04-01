package com.fms.controller;

import com.fms.dto.ExpenseDTO;
import com.fms.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // GET /api/expense
    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Call expenseService.getAllByUser(userDetails.getUsername())
        // TODO: Return ResponseEntity.ok(list)
        return null;
    }

    // POST /api/expense
    @PostMapping
    public ResponseEntity<ExpenseDTO> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ExpenseDTO dto) {
        // TODO: Call expenseService.add(userDetails.getUsername(), dto)
        // TODO: Return ResponseEntity.status(201).body(saved)
        return null;
    }

    // PUT /api/expense/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDTO dto) {
        // TODO: Call expenseService.update(id, dto)
        // TODO: Return ResponseEntity.ok(updated)
        return null;
    }

    // DELETE /api/expense/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // TODO: Call expenseService.delete(id)
        // TODO: Return ResponseEntity.noContent().build()
        return null;
    }
}
