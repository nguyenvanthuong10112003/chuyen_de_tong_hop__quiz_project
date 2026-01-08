package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "class_alert")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassAlert extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String message;
    @ManyToOne
    @JoinColumn(name = "class_id")
    Clasz clasz;
    String url;
}
