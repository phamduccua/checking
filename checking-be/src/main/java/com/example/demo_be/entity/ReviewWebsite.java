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

    /**
     * Loại kiểm tra:
     * APP_NAME     - khớp chính xác tên tiến trình/app (không phân biệt hoa thường)
     * TITLE_KEYWORD - title cửa sổ chứa chuỗi này thì flag REVIEW
     */
    @Column(name = "type", nullable = false, length = 50)
    private String type = "APP_NAME";

    @Column(name = "web_name", nullable = false, unique = true, length = 255)
    private String webName;
}
