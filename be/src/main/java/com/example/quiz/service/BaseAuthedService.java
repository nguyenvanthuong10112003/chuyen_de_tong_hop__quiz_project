package com.example.quiz.service;

import com.example.quiz.dto.request.PageableRequest;
import com.example.quiz.entity.User;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;

public class BaseAuthedService {
    @Autowired
    UserRepository userRepository;
    protected String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    protected User getCurrentUser() {
        return userRepository.findById(getCurrentUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
    protected Pageable buildPageable(PageableRequest<?> request) {
        return Pageable
            .ofSize(request.getPageSize())
            .withPage(request.getPageNumber() - 1);
    }
}
