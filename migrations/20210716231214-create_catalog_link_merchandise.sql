-- +migrate Up
CREATE TABLE IF NOT EXISTS catalog_link_merchandise(
    `id` integer PRIMARY KEY AUTO_INCREMENT,
    `layer_root` integer DEFAULT null ,
    `layer_a` integer DEFAULT null ,
    `layer_b` integer DEFAULT null ,
    `layer_c` integer DEFAULT null ,
    `layer_d` integer DEFAULT null ,
    `merchandise_id` integer,
    `hidden` tinyint  DEFAULT 0 COMMENT '不隱藏:0,隱藏:1',
    `created_at`datetime,
    `updated_at`datetime
) ENGINE = InnoDB DEFAULT COLLATE = utf8mb4_unicode_ci COMMENT = '商品連結目錄列表';
-- +migrate Down
Drop TABLE IF EXISTS  catalog_link_merchandise;