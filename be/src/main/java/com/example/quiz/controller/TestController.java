package com.example.quiz.controller;

import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.ResponseApi;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import com.example.quiz.dto.response.TestResponse;
import com.example.quiz.service.TestService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.Map;


@RestController
@RequestMapping("/tests")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TestController {
    @Autowired
    TestService testService;

    @PostMapping("/create")
    public ResponseApi<?> createTest(@RequestBody @Valid TestAddRequest request) {
         testService.createTest(request);
         return ResponseApi.createSuccess();
    }

    @GetMapping("/{id}")
    public ResponseApi<TestResponse> getById(@PathVariable @NotBlank String id) {
        return ResponseApi.createSuccess(testService.getById(id));
    }

    @PostMapping("/update")
    public ResponseApi<?> updateTest(@RequestBody @Valid TestUpdateRequest request) {
        testService.updateTest(request);
        return ResponseApi.createSuccess();
    }

    @PostMapping("/session/create")
    public ResponseApi<?> createSession(@RequestBody @Valid SessionAddRequest request) {
        return ResponseApi.createSuccess(testService.createSession(request));
    }

    @PostMapping("/session/change-answer")
    public ResponseApi<?> changeAnswer(@RequestBody @Valid ChangeAnswerSessionRequest request) {
        testService.changeAnswer(request);
        return ResponseApi.createSuccess();
    }

    @GetMapping("/session/{id}")
    public ResponseApi<?> getSessionById(@PathVariable("id") String sessionId) {
        return ResponseApi.createSuccess(testService.getSessionById(sessionId));
    }

    @PostMapping("/session/submit")
    public ResponseApi<?> submit(@RequestBody Map<String, String> params) {
        String sessionId = params.get("sessionId");
        if (Strings.isBlank(sessionId))
            throw new RuntimeException("sessionId required");
        testService.submit(sessionId, false);
        return ResponseApi.createSuccess();
    }

    @GetMapping("/history")
    public ResponseApi<?> history(@RequestParam String testId) {
        return ResponseApi.createSuccess(testService.getAllByTest(testId));
    }

    @GetMapping("/history-all")
    public ResponseApi<?> historyAll(@RequestParam String testId) {
        return ResponseApi.createSuccess(testService.getAllHistoryByTest(testId));
    }

    @PostMapping("/remove")
    public ResponseApi<?> deleteTest(@RequestBody Map<String, String> params) {
        String testId = params.get("testId");
        if (Strings.isBlank(testId))
            throw new RuntimeException("testId required");
        testService.deleteTest(testId);
        return ResponseApi.createSuccess();
    }

    @GetMapping("/session/changes")
    public ResponseApi<?> getAllChangeLatestInSession(@RequestParam String sessionId) {
        return ResponseApi.createSuccess(testService.getAllChangeLatestBySession(sessionId));
    }
}