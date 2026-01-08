package com.example.quiz.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.quiz.entity.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question,String> {
    @Query(nativeQuery = true, value = """
        SELECT q.* FROM question q
        WHERE q.status = 1 AND
            q.id IN (:lstQuestionId)
    """)
    List<Question> findAllByLstQuestionId(@Param("lstQuestionId") List<String> lstQuestionId);
}