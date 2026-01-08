package com.example.quiz.repository;

import com.example.quiz.entity.PhotoTemp;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PhotoTempRepository extends JpaRepository<PhotoTemp, Long> {
    Optional<PhotoTemp> findByStatusAndPhotoId(Boolean status, String photoId);
    Optional<PhotoTemp> findByPhotoId(String photoId);
    @Transactional
    @Modifying
    @Query("""
        UPDATE PhotoTemp pt
        SET pt.status = :status
        WHERE pt.photo.id = :photoId
    """)
    int updateStatus(@Param("status") Boolean status, @Param("photoId") String photoId);

    @Transactional
    @Modifying
    @Query("""
        UPDATE PhotoTemp pt
        SET pt.status = :status
        WHERE pt.photo.id IN :lstIdPhoto
        """)
    int updateStatusAll(@Param("status") Boolean status, @Param("lstIdPhoto") @NotEmpty List<String> lstIdPhoto);
}
