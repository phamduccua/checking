package com.example.demo_be.repository;

import com.example.demo_be.entity.Log;
import com.example.demo_be.repository.customs.LogCustoms;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.security.auth.Subject;
import java.util.List;

@Repository
@Transactional
public interface LogRepository extends JpaRepository<Log, Integer>, LogCustoms {
    List<Log> findByUsernameOrderByLogTimeDesc(String username);
    void deleteBySubject(String subject);
}
