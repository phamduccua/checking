package com.example.demo_be.repository.customs.impl;
import com.example.demo_be.entity.Log;
import com.example.demo_be.model.dto.DashboardStatsDto;
import com.example.demo_be.model.dto.FlaggedDTO;
import com.example.demo_be.model.request.LogRequest;
import com.example.demo_be.model.response.LogResponse;
import com.example.demo_be.repository.customs.LogCustoms;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Repository
public class LogRepositoryImpl implements LogCustoms {

    @PersistenceContext
    private EntityManager em;

    @Override
    public DashboardStatsDto getStats(String subject) {
        String sql = "SELECT\n" +
            "COUNT(*) AS total_logs," +
            "IFNULL(SUM(flag = 'REVIEW'), 0) AS flagged_logs," +
            "COUNT(DISTINCT CASE WHEN flag = 'REVIEW' THEN username END) AS users_need_review \n"+
        "FROM logs\n" +
        "WHERE subject = " + "'" + subject + "'";
        Query query = em.createNativeQuery(sql);

        Object[] r = (Object[]) query.getSingleResult();

        return new DashboardStatsDto(
                ((Number) r[0]).intValue(),
                ((Number) r[1]).intValue(),
                ((Number) r[2]).intValue()
        );
    }

    @Override
    public List<FlaggedDTO> getFlagged(String subject, int limit, int offset) {
        String sql =
                "SELECT " +
                        " l.username, " +
                        " u.fullname, " +
                        " l.app_name, " +
                        " l.title, " +
                        " l.log_time " +
                        "FROM logs l " +
                        "JOIN users u ON l.username = u.username " +
                        "WHERE l.subject = ?1 " +
                        "AND l.flag = 'REVIEW' " +
                        "ORDER BY l.log_time DESC";

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, subject);

        // ✅ PHÂN TRANG
        query.setFirstResult(offset);   // OFFSET
        query.setMaxResults(limit);     // LIMIT

        List<Object[]> rows = query.getResultList();
        List<FlaggedDTO> result = new ArrayList<>();

        for (Object[] r : rows) {
            result.add(new FlaggedDTO(
                    (String) r[0],
                    (String) r[1],
                    (String) r[2],
                    (String) r[3],
                    ((java.sql.Timestamp) r[4]).toLocalDateTime()
            ));
        }

        return result;
    }

    @Override
    public List<LogResponse> getLog(LogRequest logRequest) {

        StringBuilder sql = new StringBuilder();
        sql.append("""
        SELECT 
            l.id,
            l.username,
            l.app_name,
            l.title,
            l.log_time,
            l.subject,
            l.flag,
            u.fullname
        FROM logs l
        LEFT JOIN users u ON l.username = u.username
        WHERE 1 = 1
    """);

        if (logRequest.getUsername() != null && !logRequest.getUsername().isEmpty()) {
            sql.append(" AND l.username LIKE :username");
        }
        if (logRequest.getApp() != null && !logRequest.getApp().isEmpty()) {
            sql.append(" AND l.app_name LIKE :app");
        }
        if (logRequest.getTitle() != null && !logRequest.getTitle().isEmpty()) {
            sql.append(" AND l.title LIKE :title");
        }
        if (logRequest.getSubject() != null && !logRequest.getSubject().isEmpty()) {
            sql.append(" AND l.subject LIKE :subject");
        }
        if (logRequest.getFlag() != null && !logRequest.getFlag().isEmpty()) {
            sql.append(" AND l.flag LIKE :flag");
        }

        sql.append(" ORDER BY l.log_time DESC");
        sql.append(" LIMIT :limit OFFSET :offset");

        Query query = em.createNativeQuery(sql.toString());

        // set param
        if (logRequest.getUsername() != null && !logRequest.getUsername().isEmpty()) {
            query.setParameter("username", "%" + logRequest.getUsername() + "%");
        }
        if (logRequest.getApp() != null && !logRequest.getApp().isEmpty()) {
            query.setParameter("app", "%" + logRequest.getApp() + "%");
        }
        if (logRequest.getTitle() != null && !logRequest.getTitle().isEmpty()) {
            query.setParameter("title", "%" + logRequest.getTitle() + "%");
        }
        if (logRequest.getSubject() != null && !logRequest.getSubject().isEmpty()) {
            query.setParameter("subject", "%" + logRequest.getSubject() + "%");
        }
        if (logRequest.getFlag() != null && !logRequest.getFlag().isEmpty()) {
            query.setParameter("flag", "%" + logRequest.getFlag() + "%");
        }

        query.setParameter("limit", logRequest.getLimit());
        query.setParameter("offset", logRequest.getOffset());

        List<Object[]> results = query.getResultList();

        return results.stream().map(r -> new LogResponse(
                ((Number) r[0]).intValue(),
                (String) r[1],
                (String) r[2],
                (String) r[3],
                ((Timestamp) r[4]).toLocalDateTime(), 
                (String) r[5],
                (String) r[6],
                (String) r[7]
        )).toList();
    }

}
