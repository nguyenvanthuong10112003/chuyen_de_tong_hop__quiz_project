package com.example.quiz.mapper;

import com.example.quiz.dto.request.TestAddRequest;
import com.example.quiz.dto.request.TestUpdateRequest;
import com.example.quiz.entity.QuestionGroup;
import com.example.quiz.entity.TestQNumber;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.quiz.dto.request.TestRequest;
import com.example.quiz.dto.response.TestResponse;
import com.example.quiz.entity.Test;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PhotoMapper.class})
public abstract class TestMapper {

    public abstract List<TestResponse> toListTestResponse(List<Test> tests);

    public abstract void update(TestAddRequest request, @MappingTarget Test entity);

    @Mapping(target = "id", ignore = true)
    public abstract void update(TestUpdateRequest request, @MappingTarget Test entity);

    @Mapping(target = "countQuestion", expression = "java(countQuestion(test.getGroups()))")
    @Mapping(target = "classId", source = "test.clasz.id")
    @Mapping(target = "subjectId", source = "test.subject.id")
    @Mapping(target = "groups", ignore = true)
    public abstract TestResponse toResponse(Test test);

    int countQuestion(List<TestQNumber> qNumbers) {
        if (CollectionUtils.isEmpty(qNumbers)) return 0;
        return qNumbers.stream().mapToInt(qNumber -> qNumber.getGroup().getQuestions().size()).sum();
    }

}
