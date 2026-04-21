package com.fms.controller;

import com.fms.dto.IncomeDTO;
import com.fms.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for income record management.
 *
 * <p>All endpoints require JWT authentication. The caller's email is resolved
 * from the security context via {@code @AuthenticationPrincipal} and used to
 * scope all operations to the authenticated user.</p>
 */
@RestController
@RequestMapping("/api/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    /**
     * Returns all income records for the authenticated user, newest first.
     *
     * @param email the authenticated user's email (injected from JWT)
     * @return {@code 200 OK} with the list of income records
     */
    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAll(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(incomeService.getAllByUser(email));
    }

    /**
     * Creates a new income record for the authenticated user.
     *
     * @param email the authenticated user's email (injected from JWT)
     * @param dto   validated income payload
     * @return {@code 201 Created} with the persisted {@link IncomeDTO}
     */
    @PostMapping
    public ResponseEntity<IncomeDTO> add(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody IncomeDTO dto) {
        return ResponseEntity.status(201).body(incomeService.add(email, dto));
    }

    /**
     * Updates an existing income record.
     *
     * @param id  the id of the record to update
     * @param dto validated replacement values
     * @return {@code 200 OK} with the updated {@link IncomeDTO}
     */
    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody IncomeDTO dto) {
        return ResponseEntity.ok(incomeService.update(id, dto));
    }

    /**
     * Deletes an income record by id.
     *
     * @param id the id of the record to delete
     * @return {@code 204 No Content} on success
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incomeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
