package com.example.quiz.validator.content_request;

import com.example.quiz.dto.request.ContentRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContentValidator implements ConstraintValidator<ValidContentRequest, ContentRequest> {

    @Override
    public boolean isValid(ContentRequest value, ConstraintValidatorContext context) {
        if (value == null) return true;

        boolean noContent = (value.getContent() == null || value.getContent().isBlank());
        boolean noPhoto = (value.getPhotoId() == null || value.getPhotoId().isEmpty());

        return !(noContent && noPhoto);
    }
}