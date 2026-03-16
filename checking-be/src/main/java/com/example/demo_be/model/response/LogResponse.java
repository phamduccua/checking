package com.example.demo_be.model.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogResponse {
    private int id;
    private String username;
    private String appName;
    private String title;
    private LocalDateTime time;
    private String subject;
    private String flag;
    private String fullname;
}
