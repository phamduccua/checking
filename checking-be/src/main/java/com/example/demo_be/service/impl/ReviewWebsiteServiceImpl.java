package com.example.demo_be.service.impl;

import com.example.demo_be.entity.ReviewWebsite;
import com.example.demo_be.model.request.ReviewWebsiteRequest;
import com.example.demo_be.repository.ReviewWebsiteRepository;
import com.example.demo_be.service.ReviewWebsiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ReviewWebsiteServiceImpl implements ReviewWebsiteService {

    private static final String TYPE_APP_NAME = "APP_NAME";
    private static final String TYPE_TITLE_KEYWORD = "TITLE_KEYWORD";

    private final ReviewWebsiteRepository reviewWebsiteRepository;

    @Override
    public List<ReviewWebsite> getReviewWebsites() {
        return reviewWebsiteRepository.findAllByOrderByTypeAscIdDesc();
    }

    @Override
    public List<ReviewWebsite> createReviewWebsites(ReviewWebsiteRequest request) {
        String type = resolveType(request.getType());
        List<String> webNames = extractCreateWebNames(request);
        List<String> existedWebNames = new ArrayList<>();

        for (String webName : webNames) {
            if (reviewWebsiteRepository.existsByWebNameIgnoreCaseAndType(webName, type)) {
                existedWebNames.add(webName);
            }
        }

        if (!existedWebNames.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Entry already exists: " + String.join(", ", existedWebNames));
        }

        List<ReviewWebsite> reviewWebsites = new ArrayList<>();
        for (String webName : webNames) {
            ReviewWebsite reviewWebsite = new ReviewWebsite();
            reviewWebsite.setType(type);
            reviewWebsite.setWebName(webName);
            reviewWebsites.add(reviewWebsite);
        }

        return reviewWebsiteRepository.saveAll(reviewWebsites);
    }

    @Override
    public ReviewWebsite updateReviewWebsite(Integer id, ReviewWebsiteRequest request) {
        String type = resolveType(request.getType());
        String webName = validateAndNormalizeSingleWebName(request);

        ReviewWebsite reviewWebsite = reviewWebsiteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review web not found"));

        if (reviewWebsiteRepository.existsByWebNameIgnoreCaseAndTypeAndIdNot(webName, type, id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Entry already exists");
        }

        reviewWebsite.setType(type);
        reviewWebsite.setWebName(webName);
        return reviewWebsiteRepository.save(reviewWebsite);
    }

    @Override
    public void deleteReviewWebsite(Integer id) {
        ReviewWebsite reviewWebsite = reviewWebsiteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review web not found"));
        reviewWebsiteRepository.delete(reviewWebsite);
    }

    /**
     * Kiểm tra appName có khớp chính xác (ignore case) với bất kỳ entry loại APP_NAME không.
     */
    @Override
    public boolean isReviewWebsite(String appName) {
        if (appName == null || appName.trim().isEmpty()) {
            return false;
        }
        return reviewWebsiteRepository.existsByWebNameIgnoreCaseAndType(appName.trim(), TYPE_APP_NAME);
    }

    /**
     * Kiểm tra title cửa sổ có chứa bất kỳ keyword nào trong danh sách TITLE_KEYWORD không.
     * So sánh không phân biệt hoa thường.
     */
    @Override
    public boolean isReviewTitleKeyword(String title) {
        if (title == null || title.trim().isEmpty()) {
            return false;
        }
        String lowerTitle = title.toLowerCase();
        List<ReviewWebsite> keywords = reviewWebsiteRepository.findAllByType(TYPE_TITLE_KEYWORD);
        return keywords.stream()
                .map(rw -> rw.getWebName().toLowerCase())
                .anyMatch(lowerTitle::contains);
    }

    // ============================
    //  Private helpers
    // ============================

    private String resolveType(String type) {
        if (TYPE_TITLE_KEYWORD.equalsIgnoreCase(type)) {
            return TYPE_TITLE_KEYWORD;
        }
        return TYPE_APP_NAME; // default
    }

    private List<String> extractCreateWebNames(ReviewWebsiteRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is required");
        }

        Set<String> normalizedWebNames = new LinkedHashSet<>();

        if (request.getWebNames() != null) {
            for (String webName : request.getWebNames()) {
                addNormalizedWebName(normalizedWebNames, webName);
            }
        }

        if (normalizedWebNames.isEmpty()) {
            addNormalizedWebName(normalizedWebNames, request.getWebName());
        }

        if (normalizedWebNames.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one web name is required");
        }

        return new ArrayList<>(normalizedWebNames);
    }

    private String validateAndNormalizeSingleWebName(ReviewWebsiteRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is required");
        }

        if (request.getWebName() == null || request.getWebName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Web name is required");
        }

        return request.getWebName().trim();
    }

    private void addNormalizedWebName(Set<String> normalizedWebNames, String webName) {
        if (webName == null) {
            return;
        }

        String normalizedWebName = webName.trim();
        if (normalizedWebName.isEmpty()) {
            return;
        }

        normalizedWebNames.add(normalizedWebName);
    }
}
