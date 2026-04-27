package com.fms.controller;

import com.fms.dto.TuitionRequestDTO;
import com.fms.dto.TuitionResultDTO;
import com.fms.service.TuitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tuition")
@RequiredArgsConstructor
public class TuitionController {

    private final TuitionService tuitionService;

    // POST /api/tuition/calculate
    @PostMapping("/calculate")
    public ResponseEntity<TuitionResultDTO> calculate(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TuitionRequestDTO request) {
        TuitionResultDTO result = tuitionService.calculate(userDetails.getUsername(), request);
        return ResponseEntity.ok(result);
    }
}
