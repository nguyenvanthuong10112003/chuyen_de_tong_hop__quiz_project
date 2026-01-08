package com.example.quiz.mapper;

import com.example.quiz.dto.response.ClassRequestResponse;
import com.example.quiz.entity.ClassRequest;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ClassRequestMapper {
    ClassRequestResponse toResponse(ClassRequest entity);
    List<ClassRequestResponse> toListResponse(List<ClassRequest> requests);
}
