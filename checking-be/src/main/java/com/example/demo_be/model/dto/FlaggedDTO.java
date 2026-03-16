package com.example.demo_be.model.dto;

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
public class FlaggedDTO {
    private String username;
    private String fullname;
    private String app_name;
    private String title;
    private LocalDateTime time;
}
