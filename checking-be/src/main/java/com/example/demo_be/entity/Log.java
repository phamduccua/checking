package com.example.demo_be.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name="logs")
@Getter
@Setter
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="username", nullable=false)
    private String username;

    @Column(name="app_name")
    private String appName;

    @Column(name="title")
    private String title;

    @Column(name="log_time")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime logTime;

    @Column(name="subject")
    private String subject;

    @Column(name="flag")
    private String flag;
}
