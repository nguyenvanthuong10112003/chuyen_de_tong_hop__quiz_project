package com.example.quiz.mapper;

import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.quiz.dto.request.RegisterRequest;
import com.example.quiz.dto.request.UserUpdateRequest;
import com.example.quiz.dto.response.UserResponse;
import com.example.quiz.dto.response.UserofClassResponse;
import com.example.quiz.entity.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser (RegisterRequest request);
    List<UserResponse> toListResponse(List<User> entities);
    void toupdate(@MappingTarget User user, UserUpdateRequest request);
    @Mapping(target = "displayName", expression = "java(user.getDisplayName())")
    UserResponse toUserResponse(User user);
    UserofClassResponse toUserofClassResponse(User user);
} 