package com.example.quiz.mapper;

import com.example.quiz.dto.request.QuestionGroupAddRequest;
import com.example.quiz.dto.request.QuestionGroupEditRequest;
import com.example.quiz.dto.response.QuestionGroupResponse;
import com.example.quiz.entity.QuestionGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionMapper.class, ContentMapper.class, PhotoMapper.class})
public abstract class QuestionGroupMapper {
    @Mapping(target = "id", ignore = true)
    public abstract void update(@MappingTarget QuestionGroup group, QuestionGroupEditRequest request);
    public abstract QuestionGroup toEntity(QuestionGroupAddRequest request);
    public abstract List<QuestionGroup> toListEntity(List<QuestionGroup> requests);

    @Mapping(target = "topicId", source = "entity.topic.id")
    @Mapping(target = "subjectId", source = "entity.topic.subject.id")
    public abstract QuestionGroupResponse toResponse(QuestionGroup entity);
    public abstract List<QuestionGroupResponse> toListResponse(List<QuestionGroup> entities);

//    public List<QuestionGroupResponse> toListSessionResponse(List<SessionQuestionGroup> entities) {
//        if (entities == null || entities.isEmpty()) return Collections.emptyList();
//        entities.sort(Comparator.comparingInt(SessionQuestionGroup::getNumber));
//        return entities.stream().map(this::toResponse).toList();
//    }

    public List<QuestionGroupResponse> toListResponseSortByNumber(List<QuestionGroup> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        entities.sort(Comparator.comparingInt(QuestionGroup::getNumber));
        return entities.stream().map(this::toResponse).toList();
    }

    @Mapping(target = "session", ignore = true)
    @Mapping(target = "topic", ignore = true)
    public abstract QuestionGroup clone(QuestionGroup questionGroup);
}
