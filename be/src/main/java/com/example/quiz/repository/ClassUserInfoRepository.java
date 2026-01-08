package com.example.quiz.repository;

import com.example.quiz.entity.ClassRequest;
import com.example.quiz.entity.ClassUserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassUserInfoRepository extends JpaRepository<ClassUserInfo, String> {
    boolean existsByClaszIdAndUserIdAndStatus(String claszId, String userId, Boolean status);
    Optional<ClassUserInfo> findByClaszIdAndUserIdAndStatus(String claszId, String userId, Boolean status);
}
