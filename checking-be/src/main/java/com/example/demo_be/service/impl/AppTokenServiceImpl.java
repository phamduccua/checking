package com.example.demo_be.service.impl;

import com.example.demo_be.entity.AppToken;
import com.example.demo_be.model.request.AppTokenRequest;
import com.example.demo_be.repository.AppTokenRepository;
import com.example.demo_be.service.AppTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppTokenServiceImpl implements AppTokenService {
    private final AppTokenRepository appTokenRepository;

    @Override
    public AppToken getAppToken() {
        return getSingleAppToken(false);
    }

    @Override
    public AppToken updateAppToken(AppTokenRequest request) {
        validateRequest(request);
        AppToken appToken = getSingleAppToken(true);
        appToken.setAppToken(request.getAppToken().trim());
        return appTokenRepository.save(appToken);
    }

    @Override
    public String getCurrentAppToken() {
        AppToken appToken = getSingleAppToken(false);
        return appToken != null ? appToken.getAppToken() : null;
    }

    @Override
    public boolean isAppTokenActive(String appToken) {
        if (appToken == null) {
            return false;
        }

        if (appToken.trim().isEmpty()) {
            return false;
        }

        String currentAppToken = getCurrentAppToken();
        if (currentAppToken == null) {
            return false;
        }

        return currentAppToken.equals(appToken.trim());
    }

    private AppToken getSingleAppToken(boolean createIfMissing) {
        List<AppToken> appTokens = appTokenRepository.findAllByOrderByIdAsc();

        if (appTokens.isEmpty()) {
            if (!createIfMissing) {
                return null;
            }

            return new AppToken();
        }

        AppToken systemAppToken = appTokens.get(0);

        if (appTokens.size() > 1) {
            appTokenRepository.deleteAll(appTokens.subList(1, appTokens.size()));
        }

        return systemAppToken;
    }

    private void validateRequest(AppTokenRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is required");
        }

        if (request.getAppToken() == null || request.getAppToken().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "App token is required");
        }
    }
}
