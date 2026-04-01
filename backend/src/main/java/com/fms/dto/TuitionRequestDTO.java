package com.fms.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TuitionRequestDTO {

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal tuitionPerCourse;

    @NotNull
    @Min(1)
    private Integer numberOfCourses;

    // Optional: defaults to 0 if not provided
    private BigDecimal scholarshipAmount;
}
