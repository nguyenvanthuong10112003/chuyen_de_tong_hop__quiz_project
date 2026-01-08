package com.example.quiz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.quiz.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,String>{
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);
    @Query(value = """
        SELECT u.* FROM user u
        WHERE u.status = 1 AND
            u.email LIKE concat('%', :patternEmail, '%') AND
            u.id NOT IN (
                SELECT cui.user_id FROM clasz c
                INNER JOIN class_user_info cui
                    ON c.id = cui.class_id
                        AND cui.status = 1
                WHERE c.id = :classId
                UNION
                SELECT c.owner_id as user_id FROM clasz c
                WHERE c.id = :classId
            )
    """, nativeQuery = true)
    List<User> searchByEmail(@Param("patternEmail") String patternEmail, @Param("classId") String classId);
}
