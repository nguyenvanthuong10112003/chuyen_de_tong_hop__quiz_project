package com.example.quiz.controller;

import java.util.List;

import com.example.quiz.dto.request.QuestionGroupAddRequest;
import com.example.quiz.dto.request.QuestionGroupEditRequest;
import com.example.quiz.dto.request.RemoveRequest;
import com.example.quiz.dto.request.RemoveType;
import com.example.quiz.dto.response.QuestionGroupResponse;
import com.example.quiz.dto.response.ResponseApi;
import com.example.quiz.dto.response.SubjectResponse;
import com.example.quiz.repository.SubjectRepository;
import com.example.quiz.service.SubjectService;
import com.example.quiz.service.TopicService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.quiz.service.QuestionService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;


@RestController
@RequestMapping("/questions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionController {
    @Autowired
    QuestionService questionService;
    @Autowired
    SubjectService subjectService;
    @Autowired
    TopicService topicService;

    @GetMapping("/subjects")
    public ResponseApi<List<SubjectResponse>> getsSubject() {
        return ResponseApi.createSuccess(subjectService.getsSubjectByUser());
    }

    @PostMapping(value = "/create")
    public ResponseApi<?> create(@RequestBody @Valid QuestionGroupAddRequest request) {
        questionService.createQuestion(request);
        return ResponseApi.createSuccess();
    }

    @PostMapping(value = "/update")
    public ResponseApi<?> update(@RequestBody @Valid QuestionGroupEditRequest request) {
        questionService.updateQuestion(request);
        return ResponseApi.createSuccess();
    }

    @GetMapping(value = "/gets-by-topic")
    public ResponseApi<List<QuestionGroupResponse>> getsByTopic(@RequestParam("id") @NotEmpty String topicId) {
        return ResponseApi.createSuccess(questionService.getsByTopic(topicId));
    }

    @GetMapping(value = "/{id}")
    public ResponseApi<QuestionGroupResponse> getById(@PathVariable("id") @NotBlank String id) {
        return ResponseApi.createSuccess(questionService.getById(id));
    }

    @PostMapping(value = "/remove")
    public ResponseApi<?> remove(@RequestBody @Valid List<RemoveRequest> request) {
        questionService.delete(request);
        return ResponseApi.createSuccess();
    }

    @GetMapping(value = "/search")
    public ResponseApi<List<QuestionGroupResponse>> search(@RequestParam(required = true) String subjectId, @RequestParam(required = false) String topicId) {
        return ResponseApi.createSuccess(questionService.search(subjectId, topicId));
    }
}
