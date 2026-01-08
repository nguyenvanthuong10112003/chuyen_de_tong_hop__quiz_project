package com.example.quiz.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.example.quiz.entity.Clasz;
import com.example.quiz.entity.Photo;
import com.example.quiz.entity.Question;
import com.example.quiz.entity.TestQNumber;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
public class TestResponse {
    String id;
    String name;
    String description;
    LocalDateTime startTime;
    LocalDateTime endTime;
    Integer time;
    Integer countQuestion;
    List<TestQNumberResponse> groups;
    String classId;
    String subjectId;
    Integer totalScore;
    Integer maxCountDo;
    Boolean isMix;
    String sessionId;
}
