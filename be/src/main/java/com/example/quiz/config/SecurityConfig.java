package com.example.quiz.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {
    final String[] PUBLIC_ACTIONS = {
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/photos/{id}"
    };
    final JwtCustom jwtCustom;
    final JwtAuthEntryPoint jwtAuthEntryPoint;
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request ->
            request
                .requestMatchers(PUBLIC_ACTIONS)
                .permitAll()
                .anyRequest()
                .authenticated());

        httpSecurity.oauth2ResourceServer(outh2 ->
            outh2
                .jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtCustom))
                .authenticationEntryPoint(jwtAuthEntryPoint));

        httpSecurity.csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults());

        return httpSecurity.build();
    }
}