package com.example.quiz.controller;

import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.RegisterResponse;
import com.example.quiz.dto.response.ResponseApi;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quiz.dto.response.LoginResponse;
import com.example.quiz.dto.response.IntrospectRespone;
import com.example.quiz.service.AuthService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseApi<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        var result = authService.login(request);
        return ResponseApi.createSuccess(result);
    }
    @PostMapping("/register")
    public ResponseApi<RegisterResponse> register(@RequestBody @Valid RegisterRequest request) {
        var result = authService.register(request);
        return ResponseApi.createSuccess(result);
    }
    @PostMapping("/introspect")
    public ResponseApi<IntrospectRespone> introspect(@RequestBody IntrospectRequest request)throws ParseException, JOSEException {
        var result = authService.introspect(request);
        return ResponseApi.createSuccess(result);
    }
    @PostMapping("/logout")
    public ResponseApi<?> logout() {
        authService.logout();
        return ResponseApi.createSuccess();
    }
    @PostMapping("/refresh")
    ResponseApi<RefreshTokenResponse> refresh(@RequestBody @Valid RefreshRequest request) throws ParseException{
        var result = authService.refreshToken(request);
        return ResponseApi.createSuccess(result);
    }
}
