package com.example.quiz.validator.content_request;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ContentValidator.class)
public @interface ValidContentRequest {
    String message() default "Content and Photo cannot same be null";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}