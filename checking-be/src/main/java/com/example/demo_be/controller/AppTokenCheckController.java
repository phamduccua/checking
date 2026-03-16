package com.example.demo_be.controller;

import com.example.demo_be.service.AppTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/app-tokens")
@RequiredArgsConstructor
public class AppTokenCheckController {
    private final AppTokenService appTokenService;

    @GetMapping("/check-active")
    public ResponseEntity<?> checkActive(@RequestParam String appToken) {
        return ResponseEntity.ok(Map.of("active", appTokenService.isAppTokenActive(appToken)));
    }
}
