package com.example.demo_be.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatsResponse {
    private int total_logs;
    private int flagged_logs;
    private int users_need_review;
}
