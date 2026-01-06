package com.example.demo_be.service;

import com.example.demo_be.model.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getUsers(String usernameOrFullname,boolean isFlag, int limit, int offset);
}
