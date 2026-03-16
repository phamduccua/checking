package com.example.demo_be.repository;

import com.example.demo_be.entity.AppToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppTokenRepository extends JpaRepository<AppToken, Integer> {
    List<AppToken> findAllByOrderByIdAsc();

    Optional<AppToken> findTopByOrderByIdAsc();
}
