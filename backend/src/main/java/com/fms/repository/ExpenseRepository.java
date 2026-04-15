package com.fms.repository;

import com.fms.model.Expense;
import com.fms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

    List<Expense> findByUserOrderByDateDesc(User user);

    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);
}
