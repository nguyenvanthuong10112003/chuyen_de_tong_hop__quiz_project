package com.example.quiz.service;

import com.example.quiz.dto.response.SubjectResponse;
import com.example.quiz.mapper.SubjectMapper;
import com.example.quiz.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SubjectService extends BaseAuthedService {
    final SubjectRepository subjectRepository;
    final SubjectMapper subjectMapper;
    @Transactional
    public void deleteSubjects(List<String> lstSubjectId) {
        if (lstSubjectId == null || lstSubjectId.isEmpty()) return;
        subjectRepository.deleteMany(lstSubjectId, getCurrentUserId());
    }

    public List<SubjectResponse> getsSubjectByUser() {
        String userId = getCurrentUserId();
        var subjects = subjectRepository.findAllByUser(userId);
        return subjectMapper.toListResponse(subjects);
    }
}
