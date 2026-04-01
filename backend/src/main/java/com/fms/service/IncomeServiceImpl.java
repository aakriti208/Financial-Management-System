package com.fms.service;

import com.fms.dto.IncomeDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    @Override
    public List<IncomeDTO> getAllByUser(String userEmail) {
        // TODO: Fetch User entity by email using UserRepository
        // TODO: Retrieve all Income records via IncomeRepository.findByUserOrderByDateDesc()
        // TODO: Map each Income entity to IncomeDTO and return list
        return null;
    }

    @Override
    public IncomeDTO add(String userEmail, IncomeDTO dto) {
        // TODO: Fetch User entity by email
        // TODO: Map IncomeDTO to Income entity, set user
        // TODO: Save via IncomeRepository.save()
        // TODO: Map saved entity back to IncomeDTO and return
        return null;
    }

    @Override
    public IncomeDTO update(Long id, IncomeDTO dto) {
        // TODO: Fetch existing Income by id (throw exception if not found)
        // TODO: Update fields: amount, source, date, description
        // TODO: Save updated entity, return mapped IncomeDTO
        return null;
    }

    @Override
    public void delete(Long id) {
        // TODO: Check income exists (throw exception if not found)
        // TODO: Call IncomeRepository.deleteById(id)
    }
}
