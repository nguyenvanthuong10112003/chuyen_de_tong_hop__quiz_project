package com.example.quiz.service;

import com.example.quiz.dto.request.PageableRequest;
import com.example.quiz.dto.response.ClassAlertResponse;
import com.example.quiz.entity.ClassAlert;
import com.example.quiz.entity.Clasz;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.mapper.ClassAlertMapper;
import com.example.quiz.repository.ClassAlertRepository;
import com.example.quiz.repository.ClaszRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassAlertService extends BaseAuthedService {
    final ClassAlertRepository classAlertRepository;
    final ClassAlertMapper classAlertMapper;
    final ClaszRepository claszRepository;
    @Transactional
    public void saveAlert(Clasz clasz, String message) {
        classAlertRepository.save(ClassAlert.builder()
            .clasz(clasz)
            .message(message)
            .build());
    }

    public List<ClassAlertResponse> findAllByClass(String classId, PageableRequest<?> request) {
        if (!claszRepository.isUserInClass(getCurrentUserId(), classId))
            throw new AppException(ErrorCode.UNAUTHORIZE);
        return classAlertMapper.toListResponse(
            classAlertRepository.findAllByClass(classId, buildPageable(request)).getContent());
    }
}
