package com.example.quiz.dto.request;

import com.example.quiz.validator.image.ImageConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassCreationRequest implements Serializable {
    @NotBlank
    String name;
    String description;
    @ImageConstraint
    MultipartFile photoFile;
    @NotNull
    Boolean isPrivate;
    String keyJoin;
    Boolean isAutoApprove;
}