package com.example.quiz.repository;

import com.example.quiz.entity.ClassAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassAlertRepository extends JpaRepository<ClassAlert, String> {
    @Query("""
        SELECT ca FROM ClassAlert ca
        WHERE ca.clasz.id = :classId
        ORDER BY ca.createdTime
    """)
    Page<ClassAlert> findAllByClass(@Param("classId") String classId, Pageable pageable);
}
