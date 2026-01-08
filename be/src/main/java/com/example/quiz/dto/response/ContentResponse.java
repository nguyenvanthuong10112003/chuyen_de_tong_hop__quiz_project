package com.example.quiz.dto.response;

import com.example.quiz.entity.ContentType;
import com.example.quiz.entity.Photo;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ContentResponse {
    String content;
    String photo;
    String photoId;
    Integer no; // so thu tu
    ContentType type;
}
