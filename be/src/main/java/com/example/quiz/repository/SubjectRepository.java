package com.example.quiz.repository;

import com.example.quiz.entity.Subject;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, String> {
    @Query("""
       SELECT s
       FROM Subject s
       LEFT JOIN FETCH s.topics t
       WHERE s.status = true
         AND s.creator.id = :userId
         AND t.status = true
       ORDER BY
         s.createdTime,
         t.createdTime
       """)
    List<Subject> findAllByUser(String userId);

    boolean existsByNameAndCreatorId(String name, String creatorId);

    @Query(value = """
        SELECT s.* FROM subject s
        WHERE s.status = true AND
            s.id = :id AND
            s.creator_id = :userId AND
            s.status = :status
    """, nativeQuery = true)
    Optional<Subject> findByIdAndCreatorAndStatus(@Param("id") String id, @Param("userId") String userId, @Param("status") Long status);

    @Modifying
    @Transactional
    @Query("""
        UPDATE Subject s
        SET s.status = false
        WHERE s.id IN :lst AND
            s.id IN (
                SELECT s1.id
                FROM Subject s1
                WHERE s1.creator.id = :userId
            )
    """)
    void deleteMany(@Param("lst") @NotEmpty List<String> lst, @Param("userId") String userId);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE subject s
        SET s.status = 0
        WHERE s.id = :id
          AND s.status = 1
          AND NOT EXISTS (
              SELECT 1
              FROM topic t
              WHERE t.subject_id = t.id
                AND t.status = 1
          )
          AND EXISTS (
              SELECT 1
              FROM user u
              INNER JOIN subject s
                ON s.creator_id = u.id
              WHERE s.id = :id
                AND u.id = :userId
              LIMIT 1
          )
    """, nativeQuery = true)
    void inactiveStatus(@Param("id") String id, @Param("userId") String userId);

    Optional<Subject> findByIdAndCreatorId(String id, String creator);
}
