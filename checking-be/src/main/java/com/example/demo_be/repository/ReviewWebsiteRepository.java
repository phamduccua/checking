package com.example.demo_be.repository;

import com.example.demo_be.entity.ReviewWebsite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewWebsiteRepository extends JpaRepository<ReviewWebsite, Integer> {

    /** Lấy tất cả, sắp xếp theo type rồi id giảm dần (APP_NAME hiển thị trước TITLE_KEYWORD) */
    List<ReviewWebsite> findAllByOrderByTypeAscIdDesc();

    /** Lấy tất cả theo loại cụ thể (dùng để lấy danh sách keyword check title) */
    List<ReviewWebsite> findAllByType(String type);

    /** Kiểm tra tồn tại theo webName + type (không phân biệt hoa thường) */
    boolean existsByWebNameIgnoreCaseAndType(String webName, String type);

    /** Kiểm tra trùng khi sửa: loại trừ bản ghi hiện tại (theo id) */
    boolean existsByWebNameIgnoreCaseAndTypeAndIdNot(String webName, String type, Integer id);

    // --- các method cũ giữ lại để tương thích (có thể xóa sau khi migrate db) ---
    boolean existsByWebNameIgnoreCase(String webName);
    boolean existsByWebNameIgnoreCaseAndIdNot(String webName, Integer id);
}
