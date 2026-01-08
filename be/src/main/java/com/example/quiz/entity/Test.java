package com.example.quiz.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Test extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String description;
    @ManyToOne
    @JoinColumn(name = "class_id")
    Clasz clasz;
    @Column(nullable = false)
    LocalDateTime startTime;
    @Column(nullable = false)
    LocalDateTime endTime;
    @Column(nullable = false)
    Integer time; // thoi gian lam bai, tinh bang minutes
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("number asc")
    List<TestQNumber> groups;
    Boolean isMix; // co tron cau hoi hay khong
    @Column(nullable = false)
    Integer totalScore; // thang diem
    Integer maxCountDo; // so lan lam bai
    @ManyToOne
    @JoinColumn(name = "subject_id")
    Subject subject;
}