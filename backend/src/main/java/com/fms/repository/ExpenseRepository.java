package com.fms.repository;

import com.fms.model.Expense;
import com.fms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUser(User user);

    List<Expense> findByUserOrderByDateDesc(User user);

    List<Expense> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    @Query(value = """
            SELECT e.* FROM expenses e
            JOIN expense_embeddings ee ON e.id = ee.expense_id
            WHERE e.user_id = :userId
            ORDER BY ee.embedding <=> CAST(:queryVector AS vector)
            LIMIT :limit
            """, nativeQuery = true)
    List<Expense> findTopKSimilar(@Param("userId") Long userId,
                                  @Param("queryVector") String queryVector,
                                  @Param("limit") int limit);
}
