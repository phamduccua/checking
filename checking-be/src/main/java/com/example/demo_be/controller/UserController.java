package com.example.demo_be.controller;

import com.example.demo_be.model.dto.UserDTO;
import com.example.demo_be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("users")
    public ResponseEntity<?> getUsers(@RequestParam(defaultValue = "") String usernameOrFullname,
                                      @RequestParam(defaultValue = "false") boolean isFlag,
                                      @RequestParam(defaultValue = "30") int limit,
                                      @RequestParam(defaultValue = "0") int offset) {
        List<UserDTO> result = userService.getUsers(usernameOrFullname, isFlag, limit, offset);
        return ResponseEntity.ok(result);
    }
}
