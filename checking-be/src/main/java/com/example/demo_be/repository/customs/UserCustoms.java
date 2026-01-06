package com.example.demo_be.repository.customs;

import com.example.demo_be.model.dto.UserDTO;

import java.util.List;

public interface UserCustoms {
    List<UserDTO> getUser(String usernameOrFullname, boolean isFlag, int limit, int offset);
}
