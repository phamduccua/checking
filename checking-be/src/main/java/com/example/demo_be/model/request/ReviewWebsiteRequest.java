package com.example.demo_be.model.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewWebsiteRequest {
    /**
     * Loại kiểm tra: APP_NAME (mặc định) hoặc TITLE_KEYWORD
     */
    private String type = "APP_NAME";

    /** Dùng khi sửa (1 entry) */
    private String webName;

    /** Dùng khi tạo mới nhiều entry cùng 1 lúc */
    private List<String> webNames;
}
