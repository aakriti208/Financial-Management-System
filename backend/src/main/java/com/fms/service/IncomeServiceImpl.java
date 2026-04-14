package com.fms.service;

import com.fms.dto.IncomeDTO;
import com.fms.model.Income;
import com.fms.model.User;
import com.fms.repository.IncomeRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    @Override
    public List<IncomeDTO> getAllByUser(String userEmail) {
        User user = getUser(userEmail);
        return incomeRepository.findByUserOrderByDateDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public IncomeDTO add(String userEmail, IncomeDTO dto) {
        User user = getUser(userEmail);
        Income income = new Income();
        income.setUser(user);
        income.setAmount(dto.getAmount());
        income.setSource(dto.getSource());
        income.setSourceType(dto.getSourceType());
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());
        return toDTO(incomeRepository.save(income));
    }

    @Override
    public IncomeDTO update(Long id, IncomeDTO dto) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income record not found"));
        income.setAmount(dto.getAmount());
        income.setSource(dto.getSource());
        income.setSourceType(dto.getSourceType());
        income.setDate(dto.getDate());
        income.setDescription(dto.getDescription());
        return toDTO(incomeRepository.save(income));
    }

    @Override
    public void delete(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new RuntimeException("Income record not found");
        }
        incomeRepository.deleteById(id);
    }

    private IncomeDTO toDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setSource(income.getSource());
        dto.setSourceType(income.getSourceType());
        dto.setDate(income.getDate());
        dto.setDescription(income.getDescription());
        return dto;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
