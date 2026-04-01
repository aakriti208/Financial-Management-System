package com.fms.controller;

import com.fms.dto.AIQueryDTO;
import com.fms.dto.AIResponseDTO;
import com.fms.service.AIAdvisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIAdvisorController {

    private final AIAdvisorService aiAdvisorService;

    // POST /api/ai/ask
    @PostMapping("/ask")
    public ResponseEntity<AIResponseDTO> ask(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AIQueryDTO query) {
        // TODO: Call aiAdvisorService.ask(userDetails.getUsername(), query)
        // TODO: Return ResponseEntity.ok(response)
        return null;
    }
}
