package com.example.quiz.dto.request;

import com.example.quiz.entity.GroupType;
import com.example.quiz.entity.QuestionDifficulty;
import com.example.quiz.validator.none_match_no.NoneMatchNo;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PROTECTED)
public class QuestionGroupAddRequest {
    String subjectId;
    Boolean isSubjectCreate;
    String newSubject;
    String topicId;
    Boolean isTopicCreate;
    String newTopic;
    String description;
    Boolean canMix; // co the tron cac cau hoi trong nhom hay khong
    String title;
    @NoneMatchNo
    List<ContentRequest> contents;
    @NotNull
    QuestionDifficulty difficulty;
    @NotEmpty
    @Size(min = 1, max = 100)
    @NoneMatchNo
    List<QuestionRequest> questions;
    GroupType type;
}
