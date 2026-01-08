package com.example.quiz.service;

import com.example.quiz.dto.response.ClassRequestResponse;
import com.example.quiz.mapper.ClassRequestMapper;
import com.example.quiz.repository.ClassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClassRequestService extends BaseAuthedService {
    @Autowired
    ClassRequestRepository repository;
    @Autowired
    ClassRequestMapper mapper;
    public ClassRequestResponse getByClassId(String classId) {
        return mapper.toResponse(repository.findByClaszIdAndUserId(classId, getCurrentUserId()).orElse(null));
    }
}
