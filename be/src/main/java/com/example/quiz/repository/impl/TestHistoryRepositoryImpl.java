package com.example.quiz.repository.impl;

import com.example.quiz.defintion.Const;
import com.example.quiz.dto.response.ClassUserInfoResponse;
import com.example.quiz.dto.response.TestHistoryResponse;
import com.example.quiz.entity.ClassUserInfo;
import com.example.quiz.entity.Photo;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.mapper.ClassUserInfoMapper;
import com.example.quiz.mapper.PhotoMapper;
import com.example.quiz.mapper.TestHistoryMapper;
import com.example.quiz.repository.TestHistoryRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TestHistoryRepositoryImpl implements TestHistoryRepositoryCustom {
    @PersistenceContext
    private EntityManager em;
    @Autowired
    private ClassUserInfoMapper classUserInfoMapper;
    @Autowired
    private TestHistoryMapper testHistoryMapper;
    @Autowired
    private PhotoMapper photoMapper;

    @Override
    public List<ClassUserInfoResponse> getAllByTest(String testId) {
        String sql = """
            SELECT
                -- ===== TestHistory =====
                th.id              AS th_id,
                th.total_score     AS th_total_score,
                th.correct_num     AS th_correct_num,
                th.incorrect_num   AS th_incorrect_num,
                th.chose_num       AS th_chose_num,
                th.total_time      AS th_total_time,
                th.start_time    AS th_start_time,
                th.submit_time    AS th_submit_time,
                t.total_score ,
                t.time ,
                -- ===== ClassUserInfo =====
                cui.id             AS cui_id,
                cui.name           AS cui_name,
                cui.photo_id       AS cui_photo_id
            FROM test_history th
            JOIN class_user_info cui
                ON cui.id = th.student_id
            JOIN test t
                ON t.id = th.test_id
            WHERE th.status = 1
              AND th.test_id = :testId
            ORDER BY cui.id, th.created_time DESC
        """;

        Query query = em.createNativeQuery(sql);
        query.setParameter("testId", testId);
        List<Object[]> rs = query.getResultList();
        if (CollectionUtils.isEmpty(rs)) return List.of();
        List<ClassUserInfoResponse> lstReturn = new ArrayList<>();
        for (Object[] row : rs) {
            int index = -1;
            TestHistoryResponse testHistory = TestHistoryResponse.builder()
                .id((long) row[++index])
                .totalScore((double) row[++index])
                .correctNum((long) row[++index])
                .incorrectNum((long) row[++index])
                .choseNum((int) row[++index])
                .totalTime((long) row[++index])
                .startTime(DataUtil.toLocalDateTime(row[++index], Const.DateTimePattern.YYYY_MM_DD_HH_II_SS))
                .submitTime(DataUtil.toLocalDateTime(row[++index], Const.DateTimePattern.YYYY_MM_DD_HH_II_SS))
                .maxScore((int) row[++index])
                .time((int) row[++index])
                .build();
            ClassUserInfoResponse classUserInfo = ClassUserInfoResponse.builder()
                .id(String.valueOf(row[++index]))
                .name(String.valueOf(row[++index]))
                .photo(photoMapper.toPhotoUrl(Photo.builder().id(String.valueOf(row[++index])).build()))
                .build();
            ClassUserInfoResponse lastest = CollectionUtils.isEmpty(lstReturn) ? null : lstReturn.get(lstReturn.size() - 1);
            if (lastest != null && lastest.getId().equals(classUserInfo.getId())) {
                lastest.getHistories().add(testHistory);
                continue;
            }
            classUserInfo.setHistories(new ArrayList<>() {{add(testHistory);}});
            lstReturn.add(classUserInfo);
        }
        return lstReturn;
    }
}
