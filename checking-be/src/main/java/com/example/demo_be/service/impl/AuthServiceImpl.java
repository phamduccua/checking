package com.example.demo_be.service.impl;

import com.example.demo_be.entity.User;
import com.example.demo_be.model.request.LoginRequest;
import com.example.demo_be.model.request.RegisterRequest;
import com.example.demo_be.model.response.LoginResponse;
import com.example.demo_be.repository.UserRepository;
import com.example.demo_be.service.AppTokenService;
import com.example.demo_be.service.AuthService;
import com.example.demo_be.utils.JwtTokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtTokenUtils jwtTokenUtils;
    private final AppTokenService appTokenService;

    @Override
    public void register(List<RegisterRequest> listUser) {
        try {
            for (RegisterRequest registerRequest : listUser) {
                User user = new User();
                user.setUsername(registerRequest.getUsername());
                user.setFullname(registerRequest.getFullname());
                user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
                user.setRole("USER");
                user.setStatus(1);
                userRepository.save(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOption = userRepository.findByUsernameAndStatus(loginRequest.getUsername(), 1);

        if (userOption.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = userOption.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        LoginResponse loginResponse = new LoginResponse();
        String token = jwtTokenUtils.generateToken(user);
        loginResponse.setToken(token);
        loginResponse.setRole(user.getRole());
        loginResponse.setUsername(user.getUsername());
        loginResponse.setAppToken(appTokenService.getCurrentAppToken());
        return loginResponse;
    }

    @Override
    public LoginResponse adminLogin(LoginRequest loginRequest) {
        Optional<User> userOption = userRepository.findByUsernameAndStatus(loginRequest.getUsername(), 1);

        if (userOption.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = userOption.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        if (!user.getRole().equals("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this resource");
        }

        LoginResponse loginResponse = new LoginResponse();
        String token = jwtTokenUtils.generateToken(user);
        loginResponse.setToken(token);
        loginResponse.setRole(user.getRole());
        loginResponse.setUsername(user.getUsername());
        loginResponse.setAppToken(appTokenService.getCurrentAppToken());
        return loginResponse;
    }
}
