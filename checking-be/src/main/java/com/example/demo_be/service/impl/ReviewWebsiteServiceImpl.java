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
    private final ReviewWebsiteRepository reviewWebsiteRepository; 
 
    @Override 
    public List<ReviewWebsite> getReviewWebsites() { 
        return reviewWebsiteRepository.findAllByOrderByIdDesc(); 
    } 
 
    @Override 
    public List<ReviewWebsite> createReviewWebsites(ReviewWebsiteRequest request) { 
        List<String> webNames = extractCreateWebNames(request); 
        List<String> existedWebNames = new ArrayList<>(); 
 
        for (String webName : webNames) { 
            if (reviewWebsiteRepository.existsByWebNameIgnoreCase(webName)) { 
                existedWebNames.add(webName); 
            } 
        } 
 
        if (!existedWebNames.isEmpty()) { 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Web name already exists: " + String.join(", ", existedWebNames)); 
        } 
 
        List<ReviewWebsite> reviewWebsites = new ArrayList<>(); 
        for (String webName : webNames) { 
            ReviewWebsite reviewWebsite = new ReviewWebsite(); 
            reviewWebsite.setWebName(webName); 
            reviewWebsites.add(reviewWebsite); 
        } 
 
        return reviewWebsiteRepository.saveAll(reviewWebsites); 
    }
 
    @Override 
    public ReviewWebsite updateReviewWebsite(Integer id, ReviewWebsiteRequest request) { 
        String webName = validateAndNormalizeSingleWebName(request); 
        ReviewWebsite reviewWebsite = reviewWebsiteRepository.findById(id) 
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review web not found")); 
 
        if (reviewWebsiteRepository.existsByWebNameIgnoreCaseAndIdNot(webName, id)) { 
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Web name already exists"); 
        } 
 
        reviewWebsite.setWebName(webName); 
        return reviewWebsiteRepository.save(reviewWebsite); 
    } 
 
    @Override 
    public void deleteReviewWebsite(Integer id) { 
        ReviewWebsite reviewWebsite = reviewWebsiteRepository.findById(id) 
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review web not found")); 
        reviewWebsiteRepository.delete(reviewWebsite); 
    } 
 
    @Override 
    public boolean isReviewWebsite(String webName) { 
        if (webName == null) { 
            return false; 
        } 
 
        String normalizedWebName = webName.trim(); 
        if (normalizedWebName.isEmpty()) { 
            return false; 
        } 
 
        return reviewWebsiteRepository.existsByWebNameIgnoreCase(normalizedWebName); 
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
