package com.example.demo_be.filters;

import com.example.demo_be.entity.User;
import com.example.demo_be.utils.JwtTokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            if (isPassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");

            String token = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7); // cắt "Bearer "
            }

            if (token == null || token.isBlank()) {
                System.out.println("Token is missing!");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is missing");
                return;
            }

            final String username = jwtTokenUtils.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                User userEntity = (User) userDetailsService.loadUserByUsername(username);

                if (jwtTokenUtils.validateToken(token, userEntity)) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userEntity, null, userEntity.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid token");
                    return;
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        }
    }

    private boolean isPassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> byPassToken = Arrays.asList(
                Pair.of("/api/login", "POST"),
                Pair.of("/admin/login", "POST")
        );
        String path = request.getServletPath();
        String method = request.getMethod();

        return byPassToken.stream()
                .anyMatch(bypass ->
                        path.equals(bypass.getFirst())
                                && method.equalsIgnoreCase(bypass.getSecond()));
    }
}
