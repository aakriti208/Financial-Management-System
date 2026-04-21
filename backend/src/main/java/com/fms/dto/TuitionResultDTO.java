package com.fms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TuitionResultDTO {

    private BigDecimal tuitionPerCourse;
    private Integer numberOfCourses;
    private BigDecimal scholarshipAmount;
    private BigDecimal totalTuition;
    private BigDecimal remainingCost;
    private BigDecimal currentSavings;
    private BigDecimal monthlySurplus;
    private Boolean isAffordable;
    private Integer estimatedMonthsToSave;
    private String affordabilityMessage;
}
