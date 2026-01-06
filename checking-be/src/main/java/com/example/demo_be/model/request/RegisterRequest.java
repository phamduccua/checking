package com.example.demo_be.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String fullname;
    private String password;
}
