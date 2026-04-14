package com.fms.controller;

import com.fms.dto.IncomeDTO;
import com.fms.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAll(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(incomeService.getAllByUser(email));
    }

    @PostMapping
    public ResponseEntity<IncomeDTO> add(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody IncomeDTO dto) {
        return ResponseEntity.status(201).body(incomeService.add(email, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody IncomeDTO dto) {
        return ResponseEntity.ok(incomeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incomeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
