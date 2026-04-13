package com.fms.repository;

import com.fms.model.TuitionPlan;
import com.fms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TuitionPlanRepository extends JpaRepository<TuitionPlan, Long> {

    List<TuitionPlan> findByUser(User user);
    List<TuitionPlan> findTopByUserOrderByCreatedAtDesc(User user);
    List<TuitionPlan> findByUserOrderByCreatedAtDesc(User user);
}
