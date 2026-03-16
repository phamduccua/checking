package com.example.demo_be.controller; 
 
import com.example.demo_be.model.request.ReviewWebsiteRequest; 
import com.example.demo_be.service.ReviewWebsiteService; 
import lombok.RequiredArgsConstructor; 
import org.springframework.http.ResponseEntity; 
import org.springframework.web.bind.annotation.DeleteMapping; 
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.PathVariable; 
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.PutMapping; 
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.RequestMapping; 
import org.springframework.web.bind.annotation.RestController; 
 
@RestController 
@RequestMapping("/admin/review-webs") 
@RequiredArgsConstructor 
public class ReviewWebsiteController { 
    private final ReviewWebsiteService reviewWebsiteService; 
 
    @GetMapping("") 
    public ResponseEntity<?> getReviewWebsites() { 
        return ResponseEntity.ok(reviewWebsiteService.getReviewWebsites()); 
    } 
 
    @PostMapping("") 
    public ResponseEntity<?> createReviewWebsites(@RequestBody ReviewWebsiteRequest request) { 
        return ResponseEntity.ok(reviewWebsiteService.createReviewWebsites(request)); 
    } 
 
    @PutMapping("/{id}") 
    public ResponseEntity<?> updateReviewWebsite(@PathVariable Integer id, 
                                                 @RequestBody ReviewWebsiteRequest request) { 
        return ResponseEntity.ok(reviewWebsiteService.updateReviewWebsite(id, request)); 
    } 
 
    @DeleteMapping("/{id}") 
    public ResponseEntity<?> deleteReviewWebsite(@PathVariable Integer id) { 
        reviewWebsiteService.deleteReviewWebsite(id); 
        return ResponseEntity.ok().build(); 
    } 
}
