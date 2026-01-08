package com.example.quiz.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class BaseEntity {
    // thoi gian tao
    @Column(updatable = false)
    private LocalDateTime createdTime;
    // trang thai: 1 | true - con hoat dong, 0 | false - da bi xoa
    private Boolean status;
    // thoi gian cap nhat gan nhat
    private LocalDateTime updatedTime;

    @PrePersist
    void onCreate() {
        createdTime = LocalDateTime.now();
        status = true;
        updatedTime = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedTime = LocalDateTime.now();
    }
}
