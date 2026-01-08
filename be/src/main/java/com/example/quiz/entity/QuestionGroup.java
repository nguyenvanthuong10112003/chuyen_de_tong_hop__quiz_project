package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "question_group")
public class QuestionGroup extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String description;
    Boolean canMix; // co the tron cac cau hoi trong nhom hay khong
    String title;
    @OneToMany(cascade = CascadeType.ALL)
    List<Content> contents;
    QuestionDifficulty difficulty;
    @OneToMany(cascade = CascadeType.ALL)
    List<Question> questions;
    @ManyToOne
    @JoinColumn(name = "topic_id")
    Topic topic;
    GroupType type;
    Integer number;
    @ManyToOne
    @JoinColumn(name = "session_id")
    TestSession session;
    String parentId;
}