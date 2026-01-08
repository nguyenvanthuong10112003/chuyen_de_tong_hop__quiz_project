package com.example.quiz.dto.response;

import com.example.quiz.entity.Content;
import com.example.quiz.entity.QuestionAnswer;
import com.example.quiz.entity.QuestionType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level=AccessLevel.PRIVATE)
public class QuestionResponse {
    String id;
    List<QuestionAnswerResponse> answers;
    List<ContentResponse> contents;
    QuestionType type;
    Integer no; // so thu tu cau hoi
    List<QuestionAnswerPrivateResponse> privateAnswers;
    String answerSelectedId;
    List<QuestionAnswerResponse> lstSelected;
    Boolean isCorrect;
}
