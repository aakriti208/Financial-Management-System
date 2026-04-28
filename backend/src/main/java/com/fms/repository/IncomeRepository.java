package com.fms.repository;

import com.fms.model.Income;
import com.fms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);

    List<Income> findByUserOrderByDateDesc(User user);

    List<Income> findByUserAndDateBetween(User user, LocalDate start, LocalDate end);

    @Query(value = """
            SELECT i.* FROM income i
            JOIN income_embeddings ie ON i.id = ie.income_id
            WHERE i.user_id = :userId
            ORDER BY ie.embedding <=> CAST(:queryVector AS vector)
            LIMIT :limit
            """, nativeQuery = true)
    List<Income> findTopKSimilar(@Param("userId") Long userId,
                                 @Param("queryVector") String queryVector,
                                 @Param("limit") int limit);
}
