package com.example.quiz.controller;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.*;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.service.ClassAlertService;
import com.example.quiz.service.ClassRequestService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import com.example.quiz.service.ClassService;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/classes")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassController {
    @Autowired
    ClassService classService;
    @Autowired
    ClassAlertService classAlertService;
    @Autowired
    ClassRequestService classRequestService;
    @Autowired
    Validator validator;

    @PostMapping(value = "/create", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseApi<?> createClass(@ModelAttribute @Valid ClassCreationRequest request) {
        classService.createClass(request);
        return ResponseApi.createSuccess();
    }

    @PostMapping(value = "/update", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseApi<?> updateClass(@ModelAttribute @Valid ClassUpdateRequest request) {
        classService.updateClass(request);
        return ResponseApi.createSuccess();
    }

    @PostMapping(value = "/delete")
    public ResponseApi<?> deleteClass(@RequestBody @NotNull Map<String, String> params) {
        String classId = params.get("classId");
        if (Strings.isBlank(classId))
            throw new AppException(ErrorCode.CLASS_ID_REQUIRED);
        classService.deleteClass(classId);
        return ResponseApi.createSuccess();
    }

    @GetMapping("/mind")
    public ResponseApi<List<ClassResponse>> mindClasses() {
        return ResponseApi.createSuccess(classService.getsMindClass());
    }

    @GetMapping("/joined")
    public ResponseApi<List<ClassResponse>> joinedClasses() {
        return ResponseApi.createSuccess(classService.getsJoinedClass());
    }

    @GetMapping("/other")
    public ResponseApi<List<ClassResponse>> otherClasses(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "") String key) {
        return ResponseApi.createSuccess(
                classService.searchOtherClass(
                        PageableRequest.<SearchOtherClassParamsRequest>builder()
                                .pageSize(pageSize)
                                .pageNumber(pageNumber)
                                .params(SearchOtherClassParamsRequest.builder()
                                        .key(key)
                                        .build())
                                .build()));
    }

    @GetMapping("/alerts")
    public ResponseApi<List<ClassAlertResponse>> getsByClass(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam String classId) {
        return ResponseApi.createSuccess(
                classAlertService.findAllByClass(
                        classId,
                        PageableRequest.<SearchOtherClassParamsRequest>builder()
                                .pageSize(pageSize)
                                .pageNumber(pageNumber)
                                .build()));
    }

    @GetMapping("/detail/{classId}")
    public ResponseApi<ClassDetailResponse> getDetailById(@PathVariable("classId") String classId) {
        return ResponseApi.createSuccess(classService.getDetailById(classId));
    }

    @GetMapping("/{classId}")
    public ResponseApi<ClassResponse> getById(@PathVariable("classId") String classId) {
        return ResponseApi.createSuccess(classService.getById(classId));
    }

    @GetMapping("/mind-requests")
    public ResponseApi<ClassRequestResponse> getMindRequest(@RequestParam @NotBlank String classId) {
        return ResponseApi.createSuccess(classRequestService.getByClassId(classId));
    }

    @PostMapping("/join")
    public ResponseApi<ClassRequestResponse> join(@RequestBody @Valid JoinClassRequest request) {
        return ResponseApi.createSuccess(classService.sendRequestJoinClass(request));
    }

    @PostMapping("/invite")
    public ResponseApi<ClassRequestResponse> invite(@RequestBody @Valid InviteJoinClassRequest request) {
        return ResponseApi.createSuccess(classService.inviteJoinClass(request));
    }

    @PostMapping(value = "/update-student-info", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseApi<ClassUserInfoResponse> updateStudentInfo(@ModelAttribute @Valid StudentInfoUpdateRequest request) {
        Set<ConstraintViolation<StudentInfoUpdateRequest>> violations = validator.validate(request);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<StudentInfoUpdateRequest> constraintViolation : violations) {
                if (constraintViolation != null)
                    throw new RuntimeException(constraintViolation.getMessage());
            }
            throw new AppException(ErrorCode.EXCEPTION);
        }

        return ResponseApi.createSuccess(classService.updateInfoStudent(request));
    }

    @PostMapping("/leave")
    public ResponseApi<?> leave(@RequestBody Map<String, String> params) {
        String classId = params.get("classId");
        if (Strings.isBlank(classId))
            throw new AppException(ErrorCode.CLASS_ID_REQUIRED);
        classService.leaveClass(classId);
        return ResponseApi.createSuccess();
    }

    @PostMapping("/accept-request")
    public ResponseApi<ClassUserInfoResponse> acceptRequest(@RequestBody Map<String, String> request) {
        String requestId = request.get("requestId");
        if (Strings.isBlank(requestId))
            throw new AppException(ErrorCode.CLASS_ID_REQUIRED);
        return ResponseApi.createSuccess(classService.acceptRequest(requestId));
    }

    @PostMapping("/kick-student")
    public ResponseApi<?> kickStudent(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
        if (Strings.isBlank(studentId))
            throw new AppException(ErrorCode.STUDENT_ID_REQUIRED);
        classService.kickUser(studentId);
        return ResponseApi.createSuccess();
    }

    @PostMapping("/accept-invite")
    public ResponseApi<?> acceptInvite(@RequestBody Map<String, String> request) {
        String requestId = request.get("requestId");
        if (Strings.isBlank(requestId))
            throw new AppException(ErrorCode.REQUEST_ID_REQUIRED);
        classService.acceptInvite(requestId);
        return ResponseApi.createSuccess();
    }
}