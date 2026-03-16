package com.example.demo_be.controller;

import com.example.demo_be.model.request.AppTokenRequest;
import com.example.demo_be.service.AppTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/app-tokens")
@RequiredArgsConstructor
public class AppTokenController {
    private final AppTokenService appTokenService;

    @GetMapping("")
    public ResponseEntity<?> getAppToken() {
        return ResponseEntity.ok(appTokenService.getAppToken());
    }

    @PutMapping("")
    public ResponseEntity<?> updateAppToken(@RequestBody AppTokenRequest request) {
        return ResponseEntity.ok(appTokenService.updateAppToken(request));
    }
}
