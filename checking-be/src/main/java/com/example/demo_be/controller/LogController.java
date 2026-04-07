package com.example.demo_be.controller;

import com.example.demo_be.entity.Log;
import com.example.demo_be.model.dto.FlaggedDTO;
import com.example.demo_be.model.dto.LogDTO;
import com.example.demo_be.model.request.LogRequest;
import com.example.demo_be.model.response.LogResponse;
import com.example.demo_be.model.response.StatsResponse;
import com.example.demo_be.service.LogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class LogController {
    private final LogService logService;

    @PostMapping("api/logs")
    public ResponseEntity<?> addLog(@RequestBody LogDTO logDTO, HttpServletRequest request) {
        logService.addLog(logDTO, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("admin/stats")
    public ResponseEntity<?> getStats(
            @RequestParam String subject,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime startTime,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime endTime
    ) {
        StatsResponse result = logService.getStats(subject, startTime, endTime);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("admin/flagged")
    public ResponseEntity<?> getFlaggedLogs(
            @RequestParam String subject,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime startTime,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime endTime,
            @RequestParam(defaultValue = "30") int limit,
            @RequestParam(defaultValue = "0") int offset
    ) {
        List<FlaggedDTO> result = logService.getFlagged(subject, startTime, endTime, limit, offset);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("admin/logs")
    public ResponseEntity<?> getLogs(LogRequest logRequest) {
        List<LogResponse> result = logService.getLogs(logRequest);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("admin/logs/users/{username}")
    public ResponseEntity<?> getUserLogs(@PathVariable String username) {
        List<Log> result = logService.getLogsByUser(username);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("admin/logs/subject/{subject}")
    public ResponseEntity<?> deleteLog(@PathVariable String subject) {
        logService.deleteBySubject(subject);
        return ResponseEntity.ok().build();
    }
}
