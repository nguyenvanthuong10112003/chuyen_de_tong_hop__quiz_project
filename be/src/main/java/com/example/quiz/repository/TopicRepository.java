package com.example.quiz.repository;

import com.example.quiz.entity.Topic;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, String> {
    boolean existsByNameAndSubjectId(String name, String subjectId);

    Optional<Topic> findByIdAndStatus(String id, Boolean status);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE topic t
        SET t.status = 0
        WHERE t.id IN :lst AND
            t.id IN (
                SELECT t1.id FROM topic t1
                INNER JOIN subject s
                    ON s.id = t1.subject_id
                INNER JOIN user u
                    ON u.id = s.creator_id
                    AND u.id = :userId
            )
    """, nativeQuery = true)
    void deleteMany(@Param("lst") @NotEmpty List<String> lst, @Param("userId") String userId);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE topic t
        SET t.status = 0
        WHERE t.id = :id
          AND t.staus = 1
          AND NOT EXISTS (
              SELECT 1
              FROM question_group qg
              WHERE qg.topic_id = t.id
                AND qg.status = 1
              LIMIT 1
          )
          AND EXISTS (
              SELECT 1
              FROM user u
              INNER JOIN subject s
                ON s.creator_id = u.id
              INNER JOIN topic t
                ON t.subject_id = s.id
              WHERE t.id = :id
                AND u.id = :userId
              LIMIT 1
          )
    """, nativeQuery = true)
    void inactiveStatus(@Param("id") String id, @Param("userId") String userId);
}
