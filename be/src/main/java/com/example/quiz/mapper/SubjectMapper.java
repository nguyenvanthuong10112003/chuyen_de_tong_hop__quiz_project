package com.example.quiz.mapper;

import com.example.quiz.dto.response.SubjectResponse;
import com.example.quiz.dto.response.TopicResponse;
import com.example.quiz.entity.Subject;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TopicMapper.class})
public interface SubjectMapper {
    SubjectResponse toResponse(Subject entity);
    List<SubjectResponse> toListResponse(List<Subject> list);
}
