package com.example.demo_be.service; 
 
import com.example.demo_be.entity.ReviewWebsite; 
import com.example.demo_be.model.request.ReviewWebsiteRequest; 
 
import java.util.List; 
 
public interface ReviewWebsiteService { 
    List<ReviewWebsite> getReviewWebsites(); 
 
    List<ReviewWebsite> createReviewWebsites(ReviewWebsiteRequest request); 
 
    ReviewWebsite updateReviewWebsite(Integer id, ReviewWebsiteRequest request); 
 
    void deleteReviewWebsite(Integer id); 
 
    boolean isReviewWebsite(String webName); 
}
