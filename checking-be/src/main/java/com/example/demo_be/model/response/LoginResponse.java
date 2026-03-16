package com.example.demo_be.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String role;
    private String username;
    private String appToken;
}
