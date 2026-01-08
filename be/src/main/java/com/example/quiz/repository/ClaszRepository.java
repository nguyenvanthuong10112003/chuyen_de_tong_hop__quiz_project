package com.example.quiz.repository;

import java.util.List;
import java.util.Optional;

import com.example.quiz.entity.RequestType;
import com.example.quiz.entity.User;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.quiz.entity.Clasz;

@Repository
public interface ClaszRepository extends JpaRepository<Clasz,String> {

    @Query("""
       SELECT c FROM Clasz c
       LEFT JOIN c.students s
       WHERE 1 = 1 AND
            s.status = true AND
            c.status = true AND
            (
                c.owner.id = :userId OR
                s.user.id = :userId
            )
       ORDER BY c.createdTime
       """)
    List<Clasz> findAllByUser(@Param("userId") String userId);

    @Query("""
        SELECT c FROM Clasz c
        LEFT JOIN c.students s
        WHERE 1 = 1 AND
            s.status = true AND
            c.status = true AND
            (
                c.isPrivate <> true OR
                c.owner.id = :userId OR
                s.user.id = :userId
            )
    """)
    List<Clasz> findAllByPublicAndUser(@Param("userId") String userId);

    @Query(value = """
        SELECT c.* FROM clasz c
        WHERE c.status = 1
          AND c.is_private != 1
          AND (:key IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :key, '%')))
          AND c.id NOT IN (
              SELECT DISTINCT c2.id FROM clasz c2
              LEFT JOIN class_user_info cui
                ON cui.class_id = c2.id
                AND cui.status = 1
              WHERE c2.status = 1
                AND (c2.owner_id = :userId OR cui.user_id = :userId)
          )
        ORDER BY c.created_time
    """, countQuery = """
        SELECT COUNT(c.id) FROM clasz c
        WHERE c.status = 1
          AND c.is_private != 1
          AND (:key IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :key, '%')))
          AND c.id NOT IN (
              SELECT DISTINCT c2.id FROM clasz c2
              LEFT JOIN class_user_info cui
                ON cui.class_id = c2.id
                AND cui.status = 1
              WHERE c2.status = 1
                AND (c2.owner_id = :userId OR cui.user_id = :userId)
          )
    """, nativeQuery = true)
    Page<Clasz> searchAllOther(@Param("userId") String userId, @Param("key") String key, Pageable pageable);

    @Query(value = """
       SELECT c FROM Clasz c
       WHERE 1 = 1 AND
            c.status = true AND
            c.owner.id = :userId
       ORDER BY c.createdTime
       """)
    List<Clasz> findAllByOwner(@Param("userId") String userId);

    @Query(value = """
       SELECT c FROM Clasz c
       LEFT JOIN c.students s
       WHERE 1 = 1 AND
            s.status = true AND
            c.status = true AND
            s.user.id = :userId
       ORDER BY c.createdTime
       """)
    List<Clasz> findAllJoined(@Param("userId") String userId);

    @Query("""
        SELECT COUNT(c) > 0 FROM Clasz c
        WHERE c.status = true
          AND c.owner.id = :ownerId
          AND c.name = :name
       """)
    boolean existsByNameAndOwnerId(@Param("name") String name,
                                   @Param("ownerId") String ownerId);

    Optional<Clasz> findByIdAndStatus(String id, Boolean status);

    @Query("""
        SELECT COUNT(c) > 0 FROM Clasz c
        LEFT JOIN c.students s
        WHERE c.id = :id AND
            s.user.id = :userId
            AND s.status = true
    """)
    boolean existsStudent(@Param("id") String id, @Param("userId") String userId);

    @Query("""
        SELECT COUNT(c) > 0
        FROM Clasz c
        LEFT JOIN c.requests r
        WHERE c.id = r.clasz.id AND
            r.user.id = :userId AND
            r.id = :id AND
            r.type = RequestType.REQUEST
    """)
    boolean existsRequest(@Param("id") String id, @Param("userId") String userId);

    @Query("""
        SELECT COUNT(c) > 0
        FROM Clasz c
        LEFT JOIN c.requests r
        WHERE c.id = r.clasz.id AND
            r.user.id = :userId AND
            r.id = :id AND
            r.type = RequestType.INVITE
    """)
    boolean existsInvite(@Param("id") String id, @Param("userId") String userId);


    @Query("""
        SELECT COUNT(c) > 0
        FROM Clasz c
        LEFT JOIN c.students stu
        WHERE c.id = :classId
            AND stu.status = true
            AND (c.owner.id = :userId
                OR stu.user.id = :userId)
    """)
    boolean isUserInClass(@Param("userId") String userId, @Param("classId") String classId);

    boolean existsByIdAndOwnerId(String id, String ownerId);

    Optional<Clasz> findByIdAndOwnerId(String id, String ownerId);
}