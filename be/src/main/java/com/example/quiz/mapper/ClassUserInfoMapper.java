package com.example.quiz.mapper;

import com.example.quiz.dto.response.ClassUserInfoResponse;
import com.example.quiz.entity.ClassUserInfo;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PhotoMapper.class})
public interface ClassUserInfoMapper {
    ClassUserInfoResponse toResponse(ClassUserInfo entity);
    List<ClassUserInfoResponse> toListResponse(List<ClassUserInfo> list);
}
