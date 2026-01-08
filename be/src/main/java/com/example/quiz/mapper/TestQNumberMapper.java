package com.example.quiz.mapper;

import com.example.quiz.dto.response.TestQNumberResponse;
import com.example.quiz.entity.QuestionGroup;
import com.example.quiz.entity.TestQNumber;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", uses = {QuestionGroupMapper.class})
public abstract class TestQNumberMapper {
    @Autowired
    private QuestionGroupMapper questionGroupMapper;
    public abstract TestQNumberResponse toResponse(TestQNumber entity);
    public List<TestQNumberResponse> toListResponse(List<TestQNumber> entities) {
        if (entities == null || entities.isEmpty()) return Collections.emptyList();
        entities.sort(Comparator.comparingInt(TestQNumber::getNumber));
        return entities.stream().map(this::toResponse).toList();
    }
    public QuestionGroup toSessionQuestionGroup(TestQNumber testQNumber) {
        if (testQNumber == null) return null;
        QuestionGroup group = testQNumber.getGroup();
        group.setNumber(testQNumber.getNumber());
        return group;
    }
    public abstract List<QuestionGroup> toLstSessionQuestionGroup(List<TestQNumber> testQNumbers);
}
