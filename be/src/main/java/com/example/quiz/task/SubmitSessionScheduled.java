package com.example.quiz.task;

import com.example.quiz.entity.TestSession;
import com.example.quiz.repository.TestSessionRepository;
import com.example.quiz.service.TestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
public class SubmitSessionScheduled {
    @Autowired
    private TestSessionRepository testSessionRepository;
    @Autowired
    private TestService testService;
    @Scheduled(fixedRate = 10 * 1000) // every 10s
    public void submitSessionScheduled() {
        log.info("BẮT ĐẦU TIẾN TRÌNH TỰ ĐỘNG NỘP BÀI");
        var now = LocalDateTime.now();
        List<TestSession> listExpired = testSessionRepository.findAllExpired();
        if (!CollectionUtils.isEmpty(listExpired)) {
            listExpired.forEach(session -> {
                try {
                    testService.submit(session.getId(), true);
                    log.info("session {} nộp bài thành công", session.getId());
                } catch (Exception e) {
                    log.info("session {} nộp bài thất bại {}", session.getId(), e.getMessage());
                }
            });
        }
        log.info("KẾT THÚC TIẾN TRÌNH TỰ ĐỘNG NỘP BÀI ({}s)", Duration.between(now, LocalDateTime.now()).get(ChronoUnit.SECONDS));
    }
}
