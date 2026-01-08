package com.example.quiz.dto.response;

import com.example.quiz.entity.ClassUserInfo;
import com.example.quiz.entity.Test;

import java.time.LocalDateTime;
import java.util.List;

public class TestSessionResponse {
    private String id;
    private ClassUserInfo student;
    private Test test;
    private LocalDateTime submitTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isSubmitted;
    private List<QuestionGroupResponse> groups;
    private Integer time;
}
