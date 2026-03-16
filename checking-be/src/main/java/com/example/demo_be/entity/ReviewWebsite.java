package com.example.demo_be.entity; 
 
import jakarta.persistence.Column; 
import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table; 
import lombok.Getter; 
import lombok.Setter; 
 
@Entity 
@Table(name = "review_websites") 
@Getter 
@Setter 
public class ReviewWebsite { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id; 
 
    @Column(name = "web_name", nullable = false, unique = true, length = 255) 
    private String webName; 
}
