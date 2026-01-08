package com.example.quiz.controller;

import java.util.List;

import com.example.quiz.dto.request.SearchToInviteRequest;
import com.example.quiz.dto.response.ResponseApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.quiz.dto.request.UserUpdateRequest;
import com.example.quiz.dto.request.ChangePasswordRequest;
import com.example.quiz.dto.response.UserResponse;
import com.example.quiz.entity.User;
import com.example.quiz.service.UserService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/users")

@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class UserController {
    @Autowired
    UserService userService;
}
