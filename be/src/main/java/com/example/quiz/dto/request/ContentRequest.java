package com.example.quiz.dto.request;

import com.example.quiz.entity.ContentType;
import com.example.quiz.entity.Photo;
import com.example.quiz.validator.content_request.ValidContentRequest;
import com.example.quiz.validator.image.ImageConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ValidContentRequest
public class ContentRequest {
    String content;
    String photoId;
    @NotNull
    @Min(0)
    Integer no; // so thu tu
    ContentType type;
}