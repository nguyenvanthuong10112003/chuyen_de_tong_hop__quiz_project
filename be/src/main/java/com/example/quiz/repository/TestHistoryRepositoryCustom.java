package com.example.quiz.repository;

import com.example.quiz.dto.response.ClassUserInfoResponse;
import com.example.quiz.entity.ClassUserInfo;

import java.util.List;

public interface TestHistoryRepositoryCustom {
    List<ClassUserInfoResponse> getAllByTest(String testId);
}
