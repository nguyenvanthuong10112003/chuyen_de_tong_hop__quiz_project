package com.example.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "photo_data")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoData extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    byte[] data;
    String fileName;
    @Column(nullable = false)
    String contentType;
}
