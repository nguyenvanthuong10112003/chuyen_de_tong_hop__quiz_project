package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TestSession extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    @JoinColumn(name = "student_id")
    private ClassUserInfo student;
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;
    private LocalDateTime submitTime;
    @Column(nullable = false)
    private LocalDateTime startTime;
    @Column(nullable = false)
    private LocalDateTime endTime;
    private Boolean isSubmitted;
    @OneToMany(mappedBy = "session")
    private List<QuestionGroup> groups;
    @OneToMany(mappedBy = "session")
    private List<SessionChangeHistory> histories;
    private Integer time;
}