package com.fms.dto;

import lombok.Data;

@Data
public class AIResponseDTO {

    private String answer;
    private String model;
    // TODO: Add token usage, follow-up suggestions, confidence indicators
}
