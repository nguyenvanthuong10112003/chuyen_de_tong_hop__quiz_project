package com.example.quiz.dto.request;

import com.example.quiz.validator.image.ImageConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level=AccessLevel.PRIVATE)
public class ClassUpdateRequest {
    @NotBlank
    String id;
    @NotBlank
    String name;
    String description;
    @ImageConstraint
    MultipartFile photoFile;
    Boolean isPrivate;
    String keyJoin;
    Boolean isAutoApprove;
}