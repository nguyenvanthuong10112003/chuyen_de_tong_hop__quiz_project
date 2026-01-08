package com.example.quiz.dto.response;

import com.example.quiz.entity.Content;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionAnswerResponse {
    String id;
    Boolean isCorrect;
    Integer no;
    List<ContentResponse> contents;
}