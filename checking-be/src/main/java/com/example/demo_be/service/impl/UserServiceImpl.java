package com.example.demo_be.service.impl;

import com.example.demo_be.model.dto.UserDTO;
import com.example.demo_be.repository.UserRepository;
import com.example.demo_be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public List<UserDTO> getUsers(String usernameOrFullname,boolean isFlag, int limit, int offset) {
        List<UserDTO> result = userRepository.getUser(usernameOrFullname, isFlag, limit, offset);
        return result;
    }
}
