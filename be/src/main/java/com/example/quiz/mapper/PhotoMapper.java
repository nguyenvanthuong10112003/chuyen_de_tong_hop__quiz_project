package com.example.quiz.mapper;

import com.example.quiz.dto.response.PhotoResponse;
import com.example.quiz.entity.Photo;
import com.example.quiz.entity.PhotoData;
import jakarta.annotation.PostConstruct;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = "spring")
public abstract class PhotoMapper {
    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Value("${server.port}")
    private String port;
    private String baseUrl;
    @PostConstruct
    public void init() {
        baseUrl = String.format("http://localhost:%s%s/photos/", port, contextPath);
    }

    public String toPhotoUrl(Photo photo) {
        if (photo == null) return null;
        return baseUrl + photo.getId();
    }

    public PhotoResponse toResponse(Photo photo) {
        return PhotoResponse.builder().id(photo.getId()).url(toPhotoUrl(photo)).build();
    }

    public abstract Photo clone(Photo photo);
    public abstract PhotoData clone(PhotoData photoData);
}
