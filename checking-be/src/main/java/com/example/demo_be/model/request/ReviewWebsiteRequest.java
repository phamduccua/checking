package com.example.demo_be.model.request; 
 
import lombok.Getter; 
import lombok.Setter; 
 
import java.util.List; 
 
@Getter 
@Setter 
public class ReviewWebsiteRequest { 
    private String webName; 
 
    private List<String> webNames; 
}
