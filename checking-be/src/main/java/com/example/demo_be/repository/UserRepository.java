package com.example.demo_be.repository;

import com.example.demo_be.entity.User;
import com.example.demo_be.repository.customs.UserCustoms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, UserCustoms {
    Optional<User> findByUsernameAndStatus(String username, Integer status);
    User findByUsername(String username);
}
