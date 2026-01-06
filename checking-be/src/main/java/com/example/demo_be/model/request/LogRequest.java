package com.example.demo_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogRequest {
    private String username = "";
    private String app = "";
    private String title = "";
    private String subject = "";
    private String flag = "";
    private int limit = 30;
    private int offset = 0;
}
