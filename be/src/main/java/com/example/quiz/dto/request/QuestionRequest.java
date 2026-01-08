package com.example.quiz.dto.request;

import com.example.quiz.entity.QuestionType;
import com.example.quiz.validator.none_match_no.NoneMatchNo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionRequest {
    @Size(min = 2, max = 100)
    @NotEmpty
    @NoneMatchNo
    List<QuestionAnswerRequest> answers;
    @NotEmpty
    @NoneMatchNo
    List<ContentRequest> contents;
    @NotNull
    QuestionType type;
    @NotNull
    @Min(0)
    Integer no;

    String content;
    String answer;
    String choive;
}
