package com.fms.controller;

import com.fms.dto.IncomeDTO;
import com.fms.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    // GET /api/income
    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Call incomeService.getAllByUser(userDetails.getUsername())
        // TODO: Return ResponseEntity.ok(list)
        return null;
    }

    // POST /api/income
    @PostMapping
    public ResponseEntity<IncomeDTO> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody IncomeDTO dto) {
        // TODO: Call incomeService.add(userDetails.getUsername(), dto)
        // TODO: Return ResponseEntity.status(201).body(saved)
        return null;
    }

    // PUT /api/income/{id}
    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody IncomeDTO dto) {
        // TODO: Call incomeService.update(id, dto)
        // TODO: Return ResponseEntity.ok(updated)
        return null;
    }

    // DELETE /api/income/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // TODO: Call incomeService.delete(id)
        // TODO: Return ResponseEntity.noContent().build()
        return null;
    }
}
