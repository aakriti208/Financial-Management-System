package com.fms.controller;

import com.fms.dto.SimulationRequestDTO;
import com.fms.dto.SimulationResultDTO;
import com.fms.service.WhatIfSimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final WhatIfSimulationService simulationService;

    // POST /api/simulation/run
    @PostMapping("/run")
    public ResponseEntity<SimulationResultDTO> runSimulation(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody SimulationRequestDTO request) {
        // TODO: Call simulationService.runSimulation(userDetails.getUsername(), request)
        // TODO: Return ResponseEntity.ok(result)
        return null;
    }
}
