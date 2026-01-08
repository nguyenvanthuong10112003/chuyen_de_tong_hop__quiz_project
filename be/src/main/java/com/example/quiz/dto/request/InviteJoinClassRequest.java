package com.example.quiz.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InviteJoinClassRequest {
    @NotBlank
    String userId;
    @NotBlank
    String classId;
}
