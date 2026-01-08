package com.example.quiz.mapper;

import com.example.quiz.dto.response.SessionResponse;
import com.example.quiz.entity.TestSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ClassUserInfoMapper.class, TestMapper.class, QuestionGroupMapper.class})
public interface TestSessionMapper {
    @Mapping(target = "groups", ignore = true)
    @Mapping(target = "testId", source = "testSession.test.id")
    SessionResponse toResponse(TestSession testSession);
}
