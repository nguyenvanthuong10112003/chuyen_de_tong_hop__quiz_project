package com.example.quiz.mapper;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.example.quiz.dto.request.QuestionRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.quiz.dto.response.QuestionResponse;
import com.example.quiz.entity.Question;

@Mapper(componentModel = "spring", uses = {ContentMapper.class, AnswerMapper.class, PhotoMapper.class})
public abstract class QuestionMapper {
    public abstract Question toEntity(QuestionRequest request);
    public abstract List<Question> toListEntity(List<QuestionRequest> requests);

    public abstract QuestionResponse toResponse(Question entity);
    public List<QuestionResponse> toListResponse(List<Question> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        entities.sort(Comparator.comparingInt(Question::getNo));
        return entities.stream().map(this::toResponse).toList();
    }
    public abstract Question clone(Question question);
}
