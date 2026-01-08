package com.example.quiz.repository;

import com.example.quiz.entity.TestSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestSessionRepository extends JpaRepository<TestSession, String> {
    @Query(nativeQuery = true, value = """
        SELECT COUNT(1) > 0
        FROM test_session ts
        INNER JOIN class_user_info cui
            ON ts.student_id = cui.id
                AND cui.status = 1
        INNER JOIN test t
            ON t.id = ts.test_id
        WHERE t.id = :testId
            AND cui.id = :studentId
            AND t.status = 1
            AND ts.status = 1
            AND (ts.is_submitted IS NULL
                OR ts.is_submitted = 0)
            AND ts.end_time >= now()
            AND ts.start_time <= now()
    """)
    boolean existsSessionActive(@Param("testId") String testId, @Param("studentId") String studentId);
    List<TestSession> findAllByTestIdAndStudentId(String testId, String studentId);
    @Query(nativeQuery = true, value = """
        SELECT ts.*
        FROM test_session ts
        INNER JOIN class_user_info cui
            ON ts.student_id = cui.id
        INNER JOIN user u
            ON u.id = cui.user_id
        INNER JOIN test t
            ON t.id = ts.test_id
        WHERE t.id = :testId
            AND u.id = :userId
            AND t.status = 1
            AND ts.status = 1
            AND cui.status = 1
            AND (ts.is_submitted IS NULL
                OR ts.is_submitted = 0)
            AND ts.end_time >= now()
            AND ts.start_time <= now()
    """)
    Optional<TestSession> findSessionActive(@Param("testId") String testId, @Param("userId") String userId);
    @Query(nativeQuery = true, value = """
        SELECT ts.*
        FROM test_session ts
        INNER JOIN class_user_info cui
            ON ts.student_id = cui.id
                AND cui.status = 1
        INNER JOIN user u
            ON u.id = cui.user_id
        WHERE ts.id = :id
            AND u.id = :userId
            AND ts.status = 1
    """)
    Optional<TestSession> findByIdAndUser(@Param("id") String id, @Param("userId") String userId);
    @Query(nativeQuery = true, value = """
        SELECT ts.*
        FROM test_session ts
        WHERE ts.end_time < now()
            AND (ts.is_submitted IS NULL OR ts.is_submitted = 0)
    """)
    List<TestSession> findAllExpired();
}
