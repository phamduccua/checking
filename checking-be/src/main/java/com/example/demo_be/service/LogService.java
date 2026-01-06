package com.example.demo_be.service;

import com.example.demo_be.entity.Log;
import com.example.demo_be.model.dto.LogDTO;
import com.example.demo_be.model.dto.FlaggedDTO;
import com.example.demo_be.model.request.LogRequest;
import com.example.demo_be.model.response.LogResponse;
import com.example.demo_be.model.response.StatsResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface LogService {
    void addLog(LogDTO logDTO, HttpServletRequest request);
    StatsResponse getStats(String subject);
    List<FlaggedDTO> getFlagged(String subject, int limit, int offset);
    List<LogResponse> getLogs(LogRequest logRequest);
    List<Log> getLogsByUser(String username);
    void deleteBySubject(String subject);
}
