package com.example.quiz.entity;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "question")
public class Question extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToMany(cascade = CascadeType.ALL)
    List<QuestionAnswer> answers;

    @OneToMany(cascade = CascadeType.ALL)
    List<Content> contents;

    @Column(nullable = false)
    QuestionType type;

    @Column(nullable = false)
    Integer no; // so thu tu cau hoi
}