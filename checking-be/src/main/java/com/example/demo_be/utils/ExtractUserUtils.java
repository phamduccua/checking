package com.example.demo_be.utils;

import com.example.demo_be.entity.User;
import com.example.demo_be.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExtractUserUtils {

    private final JwtTokenUtils jwtTokenUtils;
    private final UserRepository userRepository;

    public User extract(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        String username = jwtTokenUtils.extractUsername(token);

        return userRepository.findByUsernameAndStatus(username, 1)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
