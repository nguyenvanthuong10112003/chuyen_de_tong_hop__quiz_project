package com.example.quiz.exception;

import com.example.quiz.dto.response.ResponseApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
     @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ResponseApi> handlingRuntimeException(RuntimeException  exception) {
         log.error(exception.getMessage());
     return ResponseEntity.badRequest().body(ResponseApi.builder().code(-1).message(exception.getMessage()).build());
    }

   @ExceptionHandler(value = AppException.class)
   ResponseEntity<ResponseApi> handlingAppException(AppException  exception){
    ResponseApi ResponseApi = new ResponseApi<>();
   ErrorCode errorCode = exception.getErrorCode();
   ResponseApi.setCode(errorCode.getCode());
    ResponseApi.setMessage(errorCode.getMessage());
    return ResponseEntity.badRequest().body(ResponseApi);
   }


   @ExceptionHandler(value = MethodArgumentNotValidException.class)
   ResponseEntity<ResponseApi> handlingValidation(MethodArgumentNotValidException  exception){
    String enumKey= exception.getFieldError().getDefaultMessage();
    ErrorCode errorCode = ErrorCode.INVALID_KEY;
    try{errorCode = ErrorCode.valueOf(enumKey);}
    catch(Exception e){

    }
    
    ResponseApi ResponseApi = new ResponseApi<>();

    ResponseApi.setCode(errorCode.getCode());

    ResponseApi.setMessage(errorCode.getMessage());

    return ResponseEntity.badRequest().body(ResponseApi);
   }
   @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseApi> handleForeignKeyConstraintViolation(DataIntegrityViolationException ex) {
        ResponseApi ResponseApi = new ResponseApi<>();
        
        // Thiết lập mã lỗi và thông điệp
        ResponseApi.setCode(400);
        ResponseApi.setMessage("Vi phạm ràng buộc khóa ngoại: " + ex.getMostSpecificCause().getMessage());

        // Trả về ResponseEntity với mã lỗi HTTP 400 (Bad Request)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseApi);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ResponseApi<?>> handleMaxSizeException(MaxUploadSizeExceededException exc) {
       ErrorCode errorCode = ErrorCode.REQUEST_SIZE_TOO_LONG;
       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseApi.createError(errorCode));
    }
}
