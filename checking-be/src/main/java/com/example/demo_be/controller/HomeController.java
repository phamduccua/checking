package com.example.demo_be.controller;

import com.example.demo_be.model.dto.LogDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping("home")
    public String home() {
        return "Hello Home Page";
    }

    @PostMapping("/logs")
    public void logs(@RequestBody LogDTO logDTO, HttpServletRequest request) {
        String token_app = request.getHeader("X-App-Token");
        if(token_app == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token-app is null");
        }
        System.out.println("Token: " + token_app);
        System.out.println(logDTO.getName() + ": " + logDTO.getTitle() + " - " + logDTO.getTime());
    }
}