package com.example.quiz.dto.request;

import com.example.quiz.validator.none_match_no.NoneMatchNo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAnswerRequest {
    Boolean isCorrect;
    @NotNull
    @Min(0)
    Integer no;
    @NotEmpty
    @NoneMatchNo
    List<ContentRequest> contents;
}
