package com.example.quiz.repository;

import com.example.quiz.entity.ClassRequest;
import com.example.quiz.entity.RequestType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRequestRepository extends JpaRepository<ClassRequest, String> {
    boolean existsByClaszIdAndTypeAndUserId(String claszId, RequestType type, String userId);
    Optional<ClassRequest> findByClaszIdAndTypeAndUserId(String claszId, RequestType type, String userId);
    Optional<ClassRequest> findByClaszIdAndUserId(String claszId, String userId);
    Optional<ClassRequest> findByIdAndType(String id, RequestType type);

    List<ClassRequest> findAllByClaszIdAndType(String classId, RequestType type);
    @Query("""
        SELECT cr FROM ClassRequest cr
        WHERE cr.status = true and
            cr.clasz.id = :classId and
            cr.user.id IN (:lstUserId) and
            cr.type = :type
    """)
    List<ClassRequest> findAllByClaszIdAndTypeAndLstUserId(@Param("classId") String claszId,
                                                           @Param("type") RequestType type,
                                                           @Param("lstUserId") List<String> lstUserId);
}
