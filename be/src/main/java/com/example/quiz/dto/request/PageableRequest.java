package com.example.quiz.dto.request;

import jakarta.validation.constraints.Min;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageableRequest<T> {
    @Min(value = 1)
    private int pageSize = 10;
    @Min(value = 1)
    private int pageNumber = 1;
    private T params;
}
