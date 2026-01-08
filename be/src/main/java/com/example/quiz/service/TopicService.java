package com.example.quiz.service;

import com.example.quiz.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService extends BaseAuthedService {
    final TopicRepository topicRepository;

    @Transactional
    public void deleteTopics(List<String> lst) {
        if (lst == null || lst.isEmpty()) return;
        topicRepository.deleteMany(lst, getCurrentUserId());
    }
}
