package com.fms.service;

import com.fms.dto.AIQueryDTO;
import com.fms.dto.AIResponseDTO;

public interface AIAdvisorService {

    AIResponseDTO ask(String userEmail, AIQueryDTO query);
}
