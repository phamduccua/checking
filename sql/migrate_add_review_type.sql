-- Migration: Thêm cột type vào bảng review_websites
-- Chạy script này nếu DB đã tồn tại (không reset lại)

ALTER TABLE review_websites
    ADD COLUMN IF NOT EXISTS `type` VARCHAR(50) NOT NULL DEFAULT 'APP_NAME'
    COMMENT 'APP_NAME: khớp chính xác tên tiến trình; TITLE_KEYWORD: flag nếu title chứa chuỗi này';

-- Cập nhật các bản ghi cũ (nếu có) về APP_NAME
UPDATE review_websites SET `type` = 'APP_NAME' WHERE `type` IS NULL OR `type` = '';

-- Xóa unique constraint cũ chỉ theo web_name (nếu tồn tại)
-- rồi tạo lại unique constraint trên (web_name, type) để cho phép cùng chuỗi ở 2 loại khác nhau
-- (chạy câu này cẩn thận nếu tên constraint khác)
-- ALTER TABLE review_websites DROP INDEX `web_name`;
-- ALTER TABLE review_websites ADD UNIQUE KEY `uq_web_name_type` (`web_name`, `type`);
