
-- +migrate Up
CREATE TABLE IF NOT EXISTS merchandise(
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar (16) ,
  `cost` int(11),
  `price` int(11),
  `statement` varchar(100),
  `launched` tinyint(1) DEFAULT 0  COMMENT '0:不上架,1:上架',
  `is_disable` tinyint(1) DEFAULT 0,
  `start_of_sale` datetime,
  `end_of_sale` datetime,
  `created_at` datetime,
  `updated_at` datetime
) ENGINE = InnoDB DEFAULT COLLATE = utf8mb4_unicode_ci COMMENT = '商品';
-- +migrate Down
Drop TABLE IF EXISTS  merchandise;
