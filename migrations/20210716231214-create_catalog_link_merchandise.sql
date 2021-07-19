-- +migrate Up
CREATE TABLE IF NOT EXISTS catalog_link_merchandise(
    `id` integer PRIMARY KEY AUTO_INCREMENT,
    `layer_root` integer DEFAULT 0 ,
    `layer_a` integer DEFAULT 0 ,
    `layer_b` integer DEFAULT 0 ,
    `layer_c` integer DEFAULT 0 ,
    `layer_d` integer DEFAULT 0 ,
    `merchandise_id` integer DEFAULT 0,
    `hidden` tinyint  DEFAULT 0 COMMENT '不隱藏:0,隱藏:1',
    `created_at`datetime,
    `updated_at`datetime
) ENGINE = InnoDB DEFAULT COLLATE = utf8mb4_unicode_ci COMMENT = '商品連結目錄列表';
-- +migrate Down
Drop TABLE IF EXISTS  catalog_link_merchandise;