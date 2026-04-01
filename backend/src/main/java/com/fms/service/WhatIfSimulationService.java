package com.fms.service;

import com.fms.dto.SimulationRequestDTO;
import com.fms.dto.SimulationResultDTO;

public interface WhatIfSimulationService {

    SimulationResultDTO runSimulation(String userEmail, SimulationRequestDTO request);
}
