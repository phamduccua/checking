package com.example.demo_be.repository.customs.impl;

import com.example.demo_be.model.dto.UserDTO;
import com.example.demo_be.repository.customs.UserCustoms;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

public class UserRepositoryImpl implements UserCustoms {
    @PersistenceContext
    private EntityManager em;
    @Override
    public List<UserDTO> getUser(String keyword, boolean isFlag, int limit, int offset) {

        String jpql = """
        SELECT new com.example.demo_be.model.dto.UserDTO(
            u.username,
            u.fullname,
            u.role,
            u.status,
            COUNT(l)
        )
        FROM User u
        LEFT JOIN Log l
            ON l.username = u.username
            AND l.flag <> 'NORMAL'
        WHERE u.username LIKE :kw
           OR u.fullname LIKE :kw
        GROUP BY u.username, u.fullname, u.role, u.status
        """;

        if (isFlag) {
            jpql += " HAVING COUNT(l) > 0";
        }

        return em.createQuery(jpql, UserDTO.class)
                .setParameter("kw", "%" + keyword + "%")
                .setFirstResult(offset)
                .setMaxResults(limit)
                .getResultList();
    }

}
