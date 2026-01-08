package com.example.quiz.dto.response;

import com.example.quiz.entity.ClassRequest;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ClassDetailResponse {
    String id;
    String name;
    String photo;
    String description;
    int studentCount;
    UserResponse owner;
    LocalDateTime createdTime;
    Boolean isPrivate;
    Boolean isUserJoined;
    Boolean isAutoApprove;
    List<ClassUserInfoResponse> students;
    List<ClassAlertResponse> alerts;
    List<TestResponse> tests;
    List<ClassRequestResponse> requests;
    ClassRequestResponse request;
}
