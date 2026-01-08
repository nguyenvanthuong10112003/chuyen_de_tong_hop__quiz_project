package com.example.quiz.mapper;

import com.example.quiz.dto.request.QuestionAnswerRequest;
import com.example.quiz.dto.response.QuestionAnswerResponse;
import com.example.quiz.entity.QuestionAnswer;
import org.mapstruct.Mapper;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ContentMapper.class, PhotoMapper.class})
public abstract class AnswerMapper {
    public abstract QuestionAnswer toEntity(QuestionAnswerRequest request);
    public abstract List<QuestionAnswer> toListEntity(List<QuestionAnswerRequest> requests);

    public abstract QuestionAnswerResponse toResponse(QuestionAnswer entity);
    public List<QuestionAnswerResponse> toListResponse(List<QuestionAnswer> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        entities.sort(Comparator.comparingInt(QuestionAnswer::getNo));
        return entities.stream().map(this::toResponse).toList();
    }
    public abstract QuestionAnswer clone(QuestionAnswer entity);
}
