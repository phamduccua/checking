package com.example.demo_be.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private int totalLogs;
    private int flaggedLogs;
    private int usersNeedReview;
    private int totalDistinctUsers;
}
