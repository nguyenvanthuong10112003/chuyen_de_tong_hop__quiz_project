package com.example.quiz.dto.request;

import com.example.quiz.entity.Clasz;
import com.example.quiz.entity.QuestionGroup;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestAddRequest {
    @NotBlank
    @Length(max = 100)
    String name;
    @Length(max = 500)
    String description;
    @NotNull
    LocalDateTime startTime;
    @NotNull
    LocalDateTime endTime;
    @NotBlank
    String classId;
    @NotNull
    @Min(1)
    Integer time;
    @NotEmpty
    List<String> lstGroupId;
    Boolean isMix;
    @NotNull
    Integer totalScore;
    @NotNull
    @Min(1)
    Integer maxCountDo;
    @NotBlank
    String subjectId;
}