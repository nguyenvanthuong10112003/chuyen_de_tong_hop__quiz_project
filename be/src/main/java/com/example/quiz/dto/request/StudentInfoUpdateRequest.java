package com.example.quiz.dto.request;

import com.example.quiz.validator.image.ImageConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentInfoUpdateRequest {
    @NotBlank
    String classId;
    @NotBlank
    String name;
    @ImageConstraint
    MultipartFile photo;
}
