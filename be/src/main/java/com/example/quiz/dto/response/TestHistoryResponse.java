package com.example.quiz.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TestHistoryResponse {
    private Long id;
    private Integer choseNum; // so cau da lam
    private LocalDateTime createdTime;
    private LocalDateTime startTime;
    private LocalDateTime submitTime;
    private Integer time;
    private Integer maxScore;

    private Double totalScore; // tong diem
    private Long correctNum; // so cau lam dung
    private Long incorrectNum; // so cau lam sai
    private Long totalTime; // thoi gian lam bai theo giay
}
