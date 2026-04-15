package com.fms.repository;

import com.fms.model.Income;
import com.fms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);

    List<Income> findByUserOrderByDateDesc(User user);

    List<Income> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}
