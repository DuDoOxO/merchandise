
-- +migrate Up
CREATE TABLE IF NOT EXISTS merchandise_catalog(
    `id` integer PRIMARY KEY AUTO_INCREMENT,
    `name` varchar (16) NOT NULL,
    `hidden` tinyint  DEFAULT 0 COMMENT '不隱藏:0,隱藏:1',
    `prev_id` integer DEFAULT 0 COMMENT '該目錄的前目錄id',
    `is_root` tinyint DEFAULT 0 COMMENT '不為根目錄:0,為根目錄:1',
    `is_disable` tinyint DEFAULT 0 ,
    `created_at`datetime,
    `updated_at`datetime
) ENGINE = InnoDB DEFAULT COLLATE = utf8mb4_unicode_ci COMMENT = '商品目錄';
-- +migrate Down
Drop TABLE IF EXISTS  merchandise_catalog;