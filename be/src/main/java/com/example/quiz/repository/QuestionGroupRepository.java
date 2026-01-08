package com.example.quiz.repository;

import com.example.quiz.entity.QuestionGroup;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, String> {
    @Query("""
            SELECT qg FROM QuestionGroup qg
            WHERE qg.topic.id = :topicId AND
                qg.topic.status = true AND
                qg.status = true AND
                qg.topic.subject.creator.id = :userId AND
                qg.topic.status = true AND
                qg.topic.subject.status = true
            ORDER BY qg.createdTime ASC
        """)
    List<QuestionGroup> findAllByTopicAndUser(@Param("topicId") String topicId, @Param("userId") String userId);

    @Query("""
            SELECT qg FROM QuestionGroup qg
            WHERE qg.id = :groupId AND
                qg.status = true AND
                qg.topic.status = true AND
                qg.topic.subject.status = true AND
                qg.topic.subject.creator.id = :userId
        """)
    Optional<QuestionGroup> findByIdAndUser(@Param("groupId") String groupId, @Param("userId") String userId);


    @Modifying
    @Transactional
    @Query(value = """
        UPDATE question_group qg
        SET qg.status = 0
        WHERE qg.id IN (
            SELECT qg2.id
            FROM question_group qg2
            INNER JOIN topic t
                ON t.id = qg2.topic_id
            INNER JOIN subject s
                ON s.id = t.subject_id
            INNER JOIN user u
                ON u.id = s.creator_id
            WHERE u.id = :userId
                AND qg2.status = 1
                AND qg2.id IN :lst
        )
    """, nativeQuery = true)
    void deleteMany(@Param("lst") @NotEmpty List<String> lst, @Param("userId") String userId);

    @Query(nativeQuery = true,
    value = """
        SELECT qg.* FROM question_group qg
        INNER JOIN topic t
            ON qg.topic_id = t.id
        INNER JOIN subject s
            ON s.id = t.subject_id
        INNER JOIN user u
            ON u.id = s.creator_id
        WHERE s.status = 1 AND
            t.status = 1 AND
            u.status = 1 AND
            qg.status = 1 AND
            u.id = :userId AND
            (IFNULL(:topicId, '') = '' OR
                t.id = :topicId) AND
            (IFNULL(:subjectId, '') = '' OR
                s.id = :subjectId)
    """)
    List<QuestionGroup> search(@Param("topicId") String topicId, @Param("subjectId") String subjectId, @Param("userId") String userId);

    @Query(nativeQuery = true,
    value = """
        SELECT qg.* FROM question_group qg
        INNER JOIN topic t
            ON qg.topic_id = t.id
        INNER JOIN subject s
            ON s.id = t.subject_id
        WHERE s.id = :subject_id AND
            qg.status = 1 AND
            t.status = 1 AND
            s.status = 1 AND
            qg.id IN (:lst_id)
    """)
    List<QuestionGroup> findAllBySubjectAndLstId(@Param("subject_id") String subjectId, @Param("lst_id") List<String> lstId);
}
