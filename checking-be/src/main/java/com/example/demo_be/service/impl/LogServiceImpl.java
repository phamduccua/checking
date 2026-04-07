package com.example.demo_be.service.impl;

import com.example.demo_be.entity.Log;
import com.example.demo_be.entity.User;
import com.example.demo_be.model.dto.DashboardStatsDto;
import com.example.demo_be.model.dto.FlaggedDTO;
import com.example.demo_be.model.dto.LogDTO;
import com.example.demo_be.model.request.LogRequest;
import com.example.demo_be.model.response.LogResponse;
import com.example.demo_be.model.response.StatsResponse;
import com.example.demo_be.repository.LogRepository;
import com.example.demo_be.repository.UserRepository;
import com.example.demo_be.service.LogService;
import com.example.demo_be.service.ReviewWebsiteService;
import com.example.demo_be.utils.ExtractUserUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {
    private static final String REVIEW_FLAG = "REVIEW";
    private static final String NORMAL_FLAG = "NORMAL";

    private final ExtractUserUtils extractUserUtils;
    private final LogRepository logRepository;
    private final UserRepository userRepository;
    private final ReviewWebsiteService reviewWebsiteService;

    @Override
    public void addLog(LogDTO logDTO, HttpServletRequest request) {
        try {
            Log log = new Log();
            String appName = normalizeValue(logDTO.getName());
            String title = normalizeValue(logDTO.getTitle());

            log.setAppName(appName);
            log.setLogTime(OffsetDateTime.now(ZoneOffset.ofHours(7)));
            log.setSubject(logDTO.getSubject());
            log.setTitle(title);
            log.setFlag(resolveFlag(appName, title));

            User user = extractUserUtils.extract(request);
            log.setUsername(user.getUsername());
            logRepository.save(log);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public StatsResponse getStats(String subject, java.time.OffsetDateTime startTime,
            java.time.OffsetDateTime endTime) {
        DashboardStatsDto result = logRepository.getStats(subject, startTime, endTime);
        StatsResponse statsResponse = new StatsResponse();
        statsResponse.setTotal_logs(result.getTotalLogs());
        statsResponse.setFlagged_logs(result.getFlaggedLogs());
        statsResponse.setUsers_need_review(result.getUsersNeedReview());
        statsResponse.setTotal_distinct_users(result.getTotalDistinctUsers());
        return statsResponse;
    }

    @Override
    public List<FlaggedDTO> getFlagged(String subject, java.time.OffsetDateTime startTime,
            java.time.OffsetDateTime endTime, int limit, int offset) {
        return logRepository.getFlagged(subject, startTime, endTime, limit, offset);
    }

    @Override
    public List<LogResponse> getLogs(LogRequest logRequest) {
        return logRepository.getLog(logRequest);
    }

    @Override
    public List<Log> getLogsByUser(String username) {
        return logRepository.findByUsernameOrderByLogTimeDesc(username);
    }

    @Override
    public void deleteBySubject(String subject) {
        logRepository.deleteBySubject(subject);
    }

    /**
     * Quyết định flag cho log:
     * - APP_NAME match → REVIEW
     * - TITLE_KEYWORD match → REVIEW
     * - Còn lại → NORMAL
     */
    private String resolveFlag(String appName, String title) {
        // Ưu tiên 1: khớp chính xác tên app/tiến trình
        if (reviewWebsiteService.isReviewWebsite(appName)) {
            return REVIEW_FLAG;
        }

        // Ưu tiên 2: title cửa sổ chứa keyword quản lý từ DB
        if (reviewWebsiteService.isReviewTitleKeyword(title)) {
            return REVIEW_FLAG;
        }

        return NORMAL_FLAG;
    }

    private String normalizeValue(String value) {
        if (value == null) {
            return null;
        }
        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
