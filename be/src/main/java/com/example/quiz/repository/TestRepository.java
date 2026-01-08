package com.example.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.quiz.entity.Test;

import java.util.Optional;

@Repository
public interface TestRepository extends JpaRepository<Test,String> {
    @Query(value = """
        SELECT t.* FROM test t
        INNER JOIN clasz c
            ON c.id = t.class_id
        LEFT JOIN class_user_info cui
            ON cui.class_id = c.id
            AND cui.user_id = :user_id
            AND cui.status = 1
        WHERE t.status = 1
            AND t.id = :id
            AND (
                c.owner_id = :user_id OR
                cui.user_id IS NOT NULL
            )
        LIMIT 1
    """, nativeQuery = true)
    Optional<Test> findByIdAndUser(@Param("id") String id, @Param("user_id") String userId);

    @Query(value = """
        SELECT CASE
            WHEN EXISTS (
                SELECT count(t.id) FROM Test t
                INNER JOIN t.clasz c
                INNER JOIN c.owner o
                WHERE t.id = :id
                    AND o.id = :user_id
                    AND t.status = true
                    AND c.status = true
                    AND o.status = true
            ) THEN 'true'
            ELSE 'false'
        END
    """)
    boolean existsByIdAndOwnerId(@Param("id") String id, @Param("user_id") String userId);

    @Query(value = """        
        SELECT t FROM Test t
        INNER JOIN t.clasz c
        INNER JOIN c.owner o
        WHERE t.id = :id
            AND o.id = :user_id
            AND t.status = true
            AND c.status = true
            AND o.status = true
    """)
    Optional<Test> findByIdAndOwnerId(@Param("id") String id, @Param("user_id") String userId);
}