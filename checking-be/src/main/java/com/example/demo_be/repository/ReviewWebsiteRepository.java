package com.example.demo_be.repository; 
 
import com.example.demo_be.entity.ReviewWebsite; 
import org.springframework.data.jpa.repository.JpaRepository; 
import org.springframework.stereotype.Repository; 
 
import java.util.List; 
 
@Repository 
public interface ReviewWebsiteRepository extends JpaRepository<ReviewWebsite, Integer> { 
    List<ReviewWebsite> findAllByOrderByIdDesc(); 
 
    boolean existsByWebNameIgnoreCase(String webName); 
 
    boolean existsByWebNameIgnoreCaseAndIdNot(String webName, Integer id); 
}
