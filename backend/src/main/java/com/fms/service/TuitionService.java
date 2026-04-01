package com.fms.service;

import com.fms.dto.TuitionRequestDTO;
import com.fms.dto.TuitionResultDTO;

public interface TuitionService {

    TuitionResultDTO calculate(String userEmail, TuitionRequestDTO request);
}
