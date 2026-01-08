package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table
@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TestHistory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;
    @ManyToOne
    @JoinColumn(name = "student_id")
    private ClassUserInfo student;
    @OneToOne
    @JoinColumn(name = "session_id")
    private TestSession session;
    private Double totalScore; // tong diem
    private Long correctNum; // so cau lam dung
    private Long incorrectNum; // so cau lam sai
    private Integer choseNum; // so cau da lam
    private Long totalTime; // thoi gian lam bai theo giay
    private LocalDateTime startTime;
    private LocalDateTime submitTime;
}