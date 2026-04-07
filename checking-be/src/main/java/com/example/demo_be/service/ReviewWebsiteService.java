package com.example.demo_be.service;

import com.example.demo_be.entity.ReviewWebsite;
import com.example.demo_be.model.request.ReviewWebsiteRequest;

import java.util.List;

public interface ReviewWebsiteService {
    List<ReviewWebsite> getReviewWebsites();

    List<ReviewWebsite> createReviewWebsites(ReviewWebsiteRequest request);

    ReviewWebsite updateReviewWebsite(Integer id, ReviewWebsiteRequest request);

    void deleteReviewWebsite(Integer id);

    /** Kiểm tra appName có khớp chính xác với entry loại APP_NAME không */
    boolean isReviewWebsite(String appName);

    /** Kiểm tra title cửa sổ có chứa bất kỳ keyword loại TITLE_KEYWORD nào không */
    boolean isReviewTitleKeyword(String title);
}
