package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "question_answer")
public class QuestionAnswer extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    Boolean isCorrect;
    @Column(nullable = false)
    Integer no;
    @OneToMany(cascade = CascadeType.ALL)
    List<Content> contents;
}