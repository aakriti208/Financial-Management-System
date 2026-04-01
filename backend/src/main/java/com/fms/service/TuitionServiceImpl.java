package com.fms.service;

import com.fms.dto.TuitionRequestDTO;
import com.fms.dto.TuitionResultDTO;
import org.springframework.stereotype.Service;

@Service
public class TuitionServiceImpl implements TuitionService {

    @Override
    public TuitionResultDTO calculate(String userEmail, TuitionRequestDTO request) {
        // TODO: Calculate grossTuition = tuitionPerCourse * numberOfCourses
        // TODO: Calculate netTuition = grossTuition - scholarshipAmount (floor at 0)
        // TODO: Fetch User by email
        // TODO: Create and save TuitionPlan entity with calculation inputs
        // TODO: Populate and return TuitionResultDTO
        return null;
    }
}
