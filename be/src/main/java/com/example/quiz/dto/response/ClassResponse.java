package com.example.quiz.dto.response;

import java.time.LocalDateTime;


import com.example.quiz.entity.ClassRequest;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ClassResponse {
    String id;
    String name;
    String photo;
    String description;
    int studentCount;
    UserResponse owner;
    LocalDateTime createdTime;
    Boolean isPrivate;
    Boolean isAutoApprove;
}
