-- mysql -u username -p < schema.sql 

-- Database
CREATE DATABASE IF NOT EXISTS `artist_dashboard`;
USE `artist_dashboard`;

-- Tables
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username_contact_email` VARCHAR(191) UNIQUE,
  `password` BINARY(60),
  `is_admin` BOOLEAN NOT NULL DEFAULT 0,
  `reset_password_token` VARCHAR(255) DEFAULT NULL,
  `reset_password_expires` BIGINT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `artist_profile`;
CREATE TABLE `artist_profile` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(30) NOT NULL UNIQUE,
  `first_name` VARCHAR(30) NOT NULL,
  `last_name` VARCHAR(30) NOT NULL,
  `username_contact_email` VARCHAR(180) UNIQUE,
  `paypal_email` VARCHAR(255),
  `phone` VARCHAR(20),
  -- Max fb username length is 50 characters
  `social_facebook` VARCHAR(100),
  -- Max ig handle length is 30 characters
  `social_instagram` VARCHAR(100),
  -- Max twitter handle length is 15 characters
  `social_twitter` VARCHAR(100),
  -- Max tumblr username length is 32 characters
  `social_tumblr` VARCHAR(100),
  `is_international` BOOLEAN,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `artist_name` VARCHAR(30) NOT NULL,
  `username_contact_email` VARCHAR(180),
  `title` VARCHAR(180),
  `description` VARCHAR(255), 
  `art_file` VARCHAR(200),
  `preview_art` VARCHAR(200),
  `status` VARCHAR(100) NOT NULL DEFAULT "NEW",
  `email_status` VARCHAR(50) NOT NULL DEFAULT "Not emailed",
  `email_color` VARCHAR(30) DEFAULT '{"color": "#6a6a6a"}',
  `email_content` VARCHAR(3000),
  `logs` VARCHAR(8000),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order` VARCHAR(20),
  `order_id` BIGINT,
  `order_created_at` DATETIME,
  `product_title` VARCHAR(255),
  `variant_sku` VARCHAR(255),
  `vendor` VARCHAR(30),
  `quantity` TINYINT,
  `product_type` VARCHAR(20),
  `commissions_amount` FLOAT(4,2),
  `is_commissions_paid` BOOLEAN NOT NULL DEFAULT 0,
  `tags` VARCHAR(150),
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `payouts`;
CREATE TABLE `payouts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_type` VARCHAR(20),
  `commissions_payout` FLOAT(4,2),
  `group` VARCHAR(50),
  PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tag` VARCHAR(30),
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `email_templates`;
CREATE TABLE `email_templates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `template_label` VARCHAR(50),
  `email_subject` VARCHAR(80),
  `email_body` VARCHAR(3000),
  `template_color` VARCHAR(10),
  `is_preview_img` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY(`id`)
);