package com.fms.controller;

import com.fms.dto.AIQueryDTO;
import com.fms.dto.AIResponseDTO;
import com.fms.service.AIAdvisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIAdvisorController {

    private final AIAdvisorService aiAdvisorService;

    // POST /api/ai/ask
    @PostMapping("/ask")
    public ResponseEntity<AIResponseDTO> ask(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody AIQueryDTO query) {
        AIResponseDTO response = aiAdvisorService.ask(email, query);
        return ResponseEntity.ok(response);
    }
}
