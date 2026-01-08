package com.example.quiz.dto.response;

import com.example.quiz.entity.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level= AccessLevel.PRIVATE)
public class QuestionGroupResponse {
    String id;
    String description;
    Boolean canMix; // co the tron cac cau hoi trong nhom hay khong
    String title;
    List<ContentResponse> contents;
    QuestionDifficulty difficulty;
    List<QuestionResponse> questions;
    GroupType type;
    String subjectId;
    String topicId;
    String sessionId;
    Long number;
    String parentId;
}