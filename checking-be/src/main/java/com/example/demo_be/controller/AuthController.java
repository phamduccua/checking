package com.example.demo_be.controller;

import com.example.demo_be.filters.JwtTokenFilter;
import com.example.demo_be.model.request.LoginRequest;
import com.example.demo_be.model.request.RegisterRequest;
import com.example.demo_be.model.response.LoginResponse;
import com.example.demo_be.service.AuthService;
import com.example.demo_be.utils.JwtTokenUtils;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenUtils jwtTokenUtils;

    @PostMapping("/admin/register")
    public ResponseEntity<?> createUsers(@RequestBody List<RegisterRequest> listUser){
        authService.register(listUser);
        return ResponseEntity.ok().body("Add successfull!");
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok().body(loginResponse);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest){
        LoginResponse loginResponse = authService.adminLogin(loginRequest);
        return ResponseEntity.ok().body(loginResponse);
    }
}
