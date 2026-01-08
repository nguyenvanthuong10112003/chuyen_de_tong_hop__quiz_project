package com.example.quiz.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCREATE_USER(9999,"uncreate existed", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1001,"Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "user existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003,"Username must be ai least  character", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "user not existed", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1006, "authenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZE(1007,"user do not have permission", HttpStatus.UNAUTHORIZED),
    INVALID_DATE(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004,"Password lớn hơn 8 kí tự", HttpStatus.BAD_REQUEST),
    ROLE_NOT_EXISTED(1005, "ROLE not existed", HttpStatus.BAD_REQUEST),
    CLASS_NOT_EXISTED(1005, "Class not existed", HttpStatus.BAD_REQUEST),
    QUESTION_NOT_EXISTED(1005, "Question not existed", HttpStatus.BAD_REQUEST),
    CLASS_USER_NOT_EXISTED(1005, "class user not existed", HttpStatus.BAD_REQUEST),
    NOT_USERID_TEST_ID(1005, "test uest not existed", HttpStatus.BAD_REQUEST),
    TEST_NOT_EXISTED(1005, "Test not existed", HttpStatus.BAD_REQUEST),
    INVALID_NUMBER_FORMAT(1006,"chuyển đổi sô thất bại", HttpStatus.BAD_REQUEST),
    PASSWORD_INCORRECT(1007,"Password incorrect", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(1008, "Token invalid", HttpStatus.UNAUTHORIZED),
    CLASS_EXISTED(1009, "Class existed", HttpStatus.BAD_REQUEST),
    PHOTO_NOT_EXISTED(1010, "Photo not existed", HttpStatus.BAD_REQUEST),
    KEY_JOIN_REQUIRED(1011, "Key join required", HttpStatus.BAD_REQUEST),
    CLASS_JOINED(1012, "Class joined", HttpStatus.BAD_REQUEST),
    CLASS_SENT(1013, "Class sent", HttpStatus.BAD_REQUEST),
    CLASS_INVITED(1014, "Class invited", HttpStatus.BAD_REQUEST),
    EXCEPTION(1015, "Error", HttpStatus.BAD_REQUEST),
    CLASS_REQUEST_NOT_EXISTED(1016, "Class request not existed", HttpStatus.BAD_REQUEST),
    CLASS_INVITE_NOT_EXISTED(1017, "Class invite not existed", HttpStatus.BAD_REQUEST),
    REQUEST_SIZE_TOO_LONG(1018, "Request size too long", HttpStatus.BAD_REQUEST),
    CLASS_ID_REQUIRED(1019, "ClassId is required", HttpStatus.BAD_REQUEST),
    REQUEST_ID_REQUIRED(1020, "RequestId is required", HttpStatus.BAD_REQUEST),
    STUDENT_ID_REQUIRED(1021, "StudentId is required", HttpStatus.BAD_REQUEST),
    START_TIME_NEED_BEFORE_END_TIME(1022, "Start time need before end time", HttpStatus.BAD_REQUEST),
    SUBJECT_NOT_EXISTED(1023, "Subject not exists", HttpStatus.BAD_REQUEST),
    ANY_QUESTION_NOT_IN_SUBJECT(1024, "Any question not in subject", HttpStatus.BAD_REQUEST)
    ;
    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
