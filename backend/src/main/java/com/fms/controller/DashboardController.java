package com.fms.controller;

import com.fms.dto.DashboardSummaryDTO;
import com.fms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(dashboardService.getSummary(email));
    }
}
