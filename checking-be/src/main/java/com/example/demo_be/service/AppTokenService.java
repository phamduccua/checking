package com.example.demo_be.service;

import com.example.demo_be.entity.AppToken;
import com.example.demo_be.model.request.AppTokenRequest;

public interface AppTokenService {
    AppToken getAppToken();

    AppToken updateAppToken(AppTokenRequest request);

    String getCurrentAppToken();

    boolean isAppTokenActive(String appToken);
}
