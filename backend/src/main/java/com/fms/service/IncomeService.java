package com.fms.service;

import com.fms.dto.IncomeDTO;

import java.util.List;

public interface IncomeService {

    List<IncomeDTO> getAllByUser(String userEmail);

    IncomeDTO add(String userEmail, IncomeDTO dto);

    IncomeDTO update(Long id, IncomeDTO dto);

    void delete(Long id);
}
