package com.example.quiz.dto.response;

import com.example.quiz.entity.Clasz;
import com.example.quiz.entity.RequestType;
import com.example.quiz.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ClassRequestResponse {
    String id;
    RequestType type;
    UserResponse user;
}
