package com.fms.controller;

import com.fms.dto.DashboardSummaryDTO;
import com.fms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // GET /api/dashboard/summary
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Call dashboardService.getSummary(userDetails.getUsername())
        // TODO: Return ResponseEntity.ok(summary)
        return null;
    }
}
