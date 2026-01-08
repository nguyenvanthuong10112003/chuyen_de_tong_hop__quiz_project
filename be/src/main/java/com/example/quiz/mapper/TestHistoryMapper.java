package com.example.quiz.mapper;

import com.example.quiz.dto.response.TestHistoryResponse;
import com.example.quiz.entity.TestHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TestHistoryMapper {
    @Mapping(target = "startTime", source = "entity.session.startTime")
    @Mapping(target = "submitTime", source = "entity.session.submitTime")
    @Mapping(target = "time", source = "entity.session.time")
    @Mapping(target = "maxScore", source = "entity.test.totalScore")
    TestHistoryResponse toResponse(TestHistory entity);
    List<TestHistoryResponse> toListResponse(List<TestHistory> entities);
}
