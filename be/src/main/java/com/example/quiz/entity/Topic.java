package com.example.quiz.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
@ToString(exclude = {"subject", "groups"})
public class Topic extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(nullable = false)
    String name;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "topic")
    List<QuestionGroup> groups;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonBackReference
    Subject subject;
}