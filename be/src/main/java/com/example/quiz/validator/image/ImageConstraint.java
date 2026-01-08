package com.example.quiz.validator.image;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Constraint(validatedBy = ImageValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ImageConstraint {
    String message() default "File must be a valid image";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
