package com.example.quiz.dto.response;

import com.example.quiz.entity.Clasz;
import com.example.quiz.entity.Photo;
import com.example.quiz.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ClassUserInfoResponse {
    String id;
    UserResponse user;
    String name;
    String photo;
    List<TestHistoryResponse> histories;
}
