package com.example.quiz.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString(exclude = {"students", "requests", "alerts", "tests"})
public class Clasz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "photo_id")
    Photo photo;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "clasz")
    @OrderBy("createdTime DESC")
    List<Test> tests;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    User owner;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "clasz")
    @OrderBy("name ASC")
    List<ClassUserInfo> students;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "clasz")
    @OrderBy("createdTime DESC")
    List<ClassRequest> requests;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "clasz")
    @OrderBy("createdTime DESC")
    List<ClassAlert> alerts;

    Boolean isPrivate;
    String keyJoin;
    Boolean isAutoApprove;
}