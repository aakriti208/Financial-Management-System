package com.fms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AIQueryDTO {

    @NotBlank
    private String question;

    // TODO: Add optional fields, e.g. includeExpenseHistory (boolean), dateRange
}
