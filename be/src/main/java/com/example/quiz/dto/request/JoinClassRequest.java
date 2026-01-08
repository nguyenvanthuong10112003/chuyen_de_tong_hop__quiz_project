package com.example.quiz.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JoinClassRequest {
    @NotBlank
    String classId;
    String keyJoin;
}
