package com.example.quiz.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.quiz.dto.request.SearchToInviteRequest;
import com.example.quiz.entity.ClassRequest;
import com.example.quiz.entity.RequestType;
import com.example.quiz.mapper.ClassRequestMapper;
import com.example.quiz.repository.ClassRequestRepository;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Service;

import com.example.quiz.dto.request.UserUpdateRequest;
import com.example.quiz.dto.response.UserResponse;
import com.example.quiz.entity.User;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.mapper.UserMapper;
import com.example.quiz.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.ObjectUtils;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService extends BaseAuthedService {
}
