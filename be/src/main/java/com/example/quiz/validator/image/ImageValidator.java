package com.example.quiz.validator.image;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class ImageValidator implements ConstraintValidator<ImageConstraint, MultipartFile> {
    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null)
            return true;
        if (file.isEmpty())
            return false;
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }
}