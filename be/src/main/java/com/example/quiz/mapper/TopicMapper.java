package com.example.quiz.mapper;

import com.example.quiz.dto.response.TopicResponse;
import com.example.quiz.entity.Topic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TopicMapper {
    TopicResponse toResponse(Topic entity);
    List<TopicResponse> toListResponse(List<Topic> list);
}
