package com.example.quiz.validator.none_match_no;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = NoneMatchNoValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NoneMatchNo {
    String message() default "Trường no bị trùng";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}