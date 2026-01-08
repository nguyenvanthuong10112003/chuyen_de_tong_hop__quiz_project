package com.example.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestQNumberResponse {
    private Long id;
    private QuestionGroupResponse group;
    private Integer number;
}
