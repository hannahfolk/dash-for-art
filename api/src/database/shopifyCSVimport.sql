
-- export orders in shopify by date as csv
-- Alter table in databsae to make it easier to accept shopify order
-- Remove time stamp " -4:00," from csv. MariaDB will throw an error
-- Import the csv into database
-- Be sure to align the columns correctly. product_type and a few others might fill something else in its spot
-- After import must run run a program to get all product types
-- Then join the payout table with the orders table

-- Alter table to accept shopify orders.

ALTER TABLE `orders`
  CHANGE COLUMN `1. Name` `order`
    varchar(20) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `52. Id` `order_id`
    bigint(20) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `16. Create at` `order_created_at`
    datetime DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `18. Lineitem name` `product_title`
    text DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `21. Lineitem sku` `variant_sku`
    TEXT;

ALTER TABLE `orders`
  CHANGE COLUMN `51. Vendor` `vendor`
    varchar(30) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `17. Lineitem quantity` `quantity`
    int(4) DEFAULT NULL;


-- Alter table back after import is complete

ALTER TABLE `orders`
  CHANGE COLUMN `order` `1. Name` 
    varchar(20) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `order_id` `52. Id` 
    bigint(20) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `order_created_at` `16. Create at` 
    datetime DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `product_title` `18. Lineitem name` 
    text DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `variant_sku` `21. Lineitem sku` 
    TEXT;

ALTER TABLE `orders`
  CHANGE COLUMN `vendor` `51. Vendor` 
    varchar(30) DEFAULT NULL;

ALTER TABLE `orders`
  CHANGE COLUMN `quantity` `17. Lineitem quantity` 
    int(4) DEFAULT NULL;


-- Join orders with payouts

SELECT `orders`.`order`, `orders`.`order_id`, `orders`.`order_created_at`, `orders`.`product_title`, 
`orders`.`vendor`, `orders`.`variant_sku`, `orders`.`quantity`, `orders`.`product_type`, 
`payouts`.`commissions_payout`, `orders`.`is_commissions_paid` 
FROM `orders` INNER JOIN  `payouts` 
ON `orders`.`product_type`=`payouts`.`product_type`
ORDER BY `order_created_at` ASC;


-- Helpful table creation to accept shopify orders

CREATE TABLE `orders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `1. Name` varchar(20) DEFAULT NULL,
  `52. Id` bigint(20) DEFAULT NULL,
  `16. Create at` datetime DEFAULT NULL,
  `18. Lineitem name` text DEFAULT NULL,
  `21. Lineitem sku` TEXT,
  `51. Vendor` varchar(30) DEFAULT NULL,
  `17. Lineitem quantity` int(4) DEFAULT NULL,
  `product_type` varchar(20) DEFAULT NULL,
  `commissions_amount` FLOAT(4,2),
  `is_commissions_paid` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

