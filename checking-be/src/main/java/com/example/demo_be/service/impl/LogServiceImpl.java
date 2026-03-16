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
 
import java.util.List; 
 
@Service 
@RequiredArgsConstructor 
public class LogServiceImpl implements LogService { 
    private static final String AI_CHECKING_APP_NAME = "AI-CHECKING"; 
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
            log.setLogTime(logDTO.getTime()); 
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
    public StatsResponse getStats(String subject) { 
        DashboardStatsDto result = logRepository.getStats(subject); 
        StatsResponse statsResponse = new StatsResponse(); 
        statsResponse.setTotal_logs(result.getTotalLogs()); 
        statsResponse.setFlagged_logs(result.getFlaggedLogs()); 
        statsResponse.setUsers_need_review(result.getUsersNeedReview()); 
        return statsResponse; 
    } 
 
    @Override 
    public List<FlaggedDTO> getFlagged(String subject, int limit, int offset) { 
        List<FlaggedDTO> result = logRepository.getFlagged(subject, limit, offset); 
        return result; 
    } 
 
    @Override 
    public List<LogResponse> getLogs(LogRequest logRequest) { 
        List<LogResponse> result = logRepository.getLog(logRequest); 
        return result; 
    } 
 
    @Override 
    public List<Log> getLogsByUser(String username) { 
        List<Log> result = logRepository.findByUsernameOrderByLogTimeDesc(username); 
        return result; 
    } 
 
    @Override 
    public void deleteBySubject(String subject) { 
        logRepository.deleteBySubject(subject); 
    }
 
    private String resolveFlag(String appName, String title) { 
        if (reviewWebsiteService.isReviewWebsite(appName)) { 
            return REVIEW_FLAG; 
        } 
 
        if (appName != null && AI_CHECKING_APP_NAME.equalsIgnoreCase(appName) && isAiCheckingReviewTitle(title)) { 
            return REVIEW_FLAG; 
        } 
 
        return NORMAL_FLAG; 
    } 
 
    private boolean isAiCheckingReviewTitle(String title) { 
        if (title == null) { 
            return false; 
        } 
 
        return title.contains("Thu \u1ecf\u1ecf") || title.contains("Tho\u00e1t"); 
    } 
 
    private String normalizeValue(String value) { 
        if (value == null) { 
            return null; 
        } 
 
        String normalizedValue = value.trim(); 
        return normalizedValue.isEmpty() ? null : normalizedValue; 
    } 
}
