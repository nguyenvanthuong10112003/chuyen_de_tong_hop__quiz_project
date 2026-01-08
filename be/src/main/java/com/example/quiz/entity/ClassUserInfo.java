package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "class_user_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ClassUserInfo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @ManyToOne
    @JoinColumn(name = "class_id")
    Clasz clasz;
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
    String name;
    @OneToOne
    @JoinColumn(name = "photo_id")
    Photo photo;
}