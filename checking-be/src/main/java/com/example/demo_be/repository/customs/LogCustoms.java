package com.example.demo_be.repository.customs;

import com.example.demo_be.entity.Log;
import com.example.demo_be.model.dto.DashboardStatsDto;
import com.example.demo_be.model.dto.FlaggedDTO;
import com.example.demo_be.model.request.LogRequest;
import com.example.demo_be.model.response.LogResponse;

import java.util.List;

public interface LogCustoms {
    DashboardStatsDto getStats(String subject);
    List<FlaggedDTO> getFlagged(String subject,int limit, int offset);
    List<LogResponse> getLog(LogRequest logRequest);
}
