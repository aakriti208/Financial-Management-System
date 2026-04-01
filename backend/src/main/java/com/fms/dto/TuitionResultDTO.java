package com.fms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TuitionResultDTO {

    private BigDecimal tuitionPerCourse;
    private Integer numberOfCourses;
    private BigDecimal scholarshipAmount;
    private BigDecimal grossTuition;
    private BigDecimal netTuition;
    // TODO: Add payment schedule, per-month breakdown, remaining budget after tuition
}
