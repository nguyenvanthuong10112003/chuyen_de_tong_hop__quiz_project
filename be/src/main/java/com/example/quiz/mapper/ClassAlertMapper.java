package com.example.quiz.mapper;

import com.example.quiz.dto.response.ClassAlertResponse;
import com.example.quiz.entity.ClassAlert;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClassAlertMapper {
    ClassAlertResponse toResponse(ClassAlert entity);
    List<ClassAlertResponse> toListResponse(List<ClassAlert> lst);
}
