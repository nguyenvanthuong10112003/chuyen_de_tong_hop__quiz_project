package com.example.quiz.service;

import com.example.quiz.config.JwtCustom;
import com.example.quiz.dto.request.*;
import com.example.quiz.dto.response.IntrospectRespone;
import com.example.quiz.dto.response.LoginResponse;
import com.example.quiz.dto.response.RegisterResponse;
import com.example.quiz.entity.InvalidatedToken;
import com.example.quiz.entity.User;
import com.example.quiz.exception.AppException;
import com.example.quiz.exception.ErrorCode;
import com.example.quiz.helper.DataUtil;
import com.example.quiz.mapper.UserMapper;
import com.example.quiz.repository.InvalidatedTokenRepository;
import com.example.quiz.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    PasswordEncoder passwordEncoder;
    JwtCustom jwtCustom;
    UserMapper userMapper;
    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(()-> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);

        var token = jwtCustom.encode(user);

        return LoginResponse.builder()
            .token(token)
            .user(userMapper.toUserResponse(user))
            .build();
    }
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User newUser = User.builder()
            .fullName(request.getFullName())
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        newUser = userRepository.save(newUser);

        var token = jwtCustom.encode(newUser);

        return RegisterResponse.builder()
            .token(token)
            .user(userMapper.toUserResponse(newUser))
            .build();
    }
    @Transactional
    public void changePassword(ChangePasswordRequest request){
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (passwordEncoder.matches(request.getOldPassword(), user.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
        String tokenId = jwtAuth.getToken().getClaims().get("jti").toString();

        if (invalidatedTokenRepository.existsById(tokenId))
            return;

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
            .id(tokenId)
            .build();

        Instant expiryTimeInstant = jwtAuth.getToken().getExpiresAt();
        if (expiryTimeInstant != null)
            invalidatedToken.setExpiryTime(DataUtil.toLocalDateTime(expiryTimeInstant));

        invalidatedTokenRepository.save(invalidatedToken);
    }
    @Transactional
    public RefreshTokenResponse refreshToken(RefreshRequest request) throws ParseException {
        String token = request.getToken();

        try {
            jwtCustom.verifyToken(token, true);
        } catch (JOSEException | ParseException | AppException e) {
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }

        SignedJWT signedJWT = SignedJWT.parse(token);
        var claimsSet = signedJWT.getJWTClaimsSet();

        String userId = claimsSet.getSubject();

        var user = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (claimsSet.getExpirationTime().before(new Date()) &&
            !invalidatedTokenRepository.existsById(claimsSet.getJWTID()))
            invalidatedTokenRepository.save(InvalidatedToken.builder()
                .id(claimsSet.getJWTID())
                .expiryTime(DataUtil.toLocalDateTime(claimsSet.getExpirationTime().toInstant()))
                .build());

        return RefreshTokenResponse.builder()
            .token(jwtCustom.encode(user))
            .build();
    }
    public IntrospectRespone introspect(IntrospectRequest request) throws ParseException, JOSEException {
        jwtCustom.verifyToken(request.getToken(), false);
        return IntrospectRespone.builder().valid(true).build();
    }
}