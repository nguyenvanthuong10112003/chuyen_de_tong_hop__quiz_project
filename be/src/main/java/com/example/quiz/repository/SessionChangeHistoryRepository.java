package com.example.quiz.repository;

import com.example.quiz.entity.SessionChangeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SessionChangeHistoryRepository extends JpaRepository<SessionChangeHistory, Long> {
    @Query(nativeQuery = true, value = """
        SELECT *
        FROM (
            SELECT sch.*,
                   ROW_NUMBER() OVER (
                       PARTITION BY sch.question_id, sch.answer_id
                       ORDER BY sch.created_time DESC
                   ) AS rn
            FROM session_change_history sch
            INNER JOIN test_session ts
                ON ts.id = sch.session_id
            WHERE ts.id = :session_id
              AND sch.created_time <= ts.end_time
              AND sch.created_time >= ts.start_time
              AND sch.status = 1
        ) t
        WHERE t.rn = 1
        ORDER BY t.question_id, t.created_time DESC
    """)
    List<SessionChangeHistory> findAllHistoryLatestBySession(@Param("session_id") String sessionId);

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = """
        UPDATE session_change_history sch
        SET sch.status = 0
        WHERE sch.status = 1
            AND sch.question_id IN (:lst_question_id)
            AND sch.session_id = :session_id
    """)
    void inactiveAllBySessionAndLstQuestion(@Param("lst_question_id") List<String> lstQuestionId, @Param("session_id") String sessionId);
}
