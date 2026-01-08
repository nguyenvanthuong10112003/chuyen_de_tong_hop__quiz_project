package com.example.quiz.repository;

import com.example.quiz.entity.TestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestHistoryRepository extends JpaRepository<TestHistory, Long>, TestHistoryRepositoryCustom {
    boolean existsBySessionId(String sessionId);
    @Query(nativeQuery = true, value = """
        SELECT th.* FROM test_history th
        INNER JOIN class_user_info cui
            ON cui.id = th.student_id
                AND cui.user_id = :userId
        WHERE th.status = 1
            AND th.test_id = :testId
        ORDER BY th.created_time
    """)
    List<TestHistory> findAllByTestIdAndUserId(@Param("testId") String testId, @Param("userId") String userId);
}
