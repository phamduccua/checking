package com.example.demo_be.service;

import com.example.demo_be.model.request.LoginRequest;
import com.example.demo_be.model.request.RegisterRequest;
import com.example.demo_be.model.response.LoginResponse;

import java.util.List;

public interface AuthService {
    void register(List<RegisterRequest> listUser);

    LoginResponse login(LoginRequest loginRequest);

    LoginResponse adminLogin(LoginRequest loginRequest);
}
