USE `artist_dashboard`;

-- Test Data

-- Insert Many 
-- INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `is_international`) 
-- VALUES ("locoMotive", "Tom", "Thomas", "tom@email.com", "tom@email.com", "", "", "", "",  true),
-- ("babyUprising", "John", "Johnson", "john@email.com", "john@email.com", "", "", "", "",  false),
-- ("jacksonFive", "Jack", "Jackson", "jack@email.com", "jack@email.com", "", "", "", "",  true),
-- ("B-train", "Bryan", "Tran", "btran@teefury.com", "btran@teefury.com", "", "", "", "",  false);

-- Commissions payout
INSERT INTO `payouts` (`product_type`, `commissions_payout`, `group`)
VALUES ("Tee", 2.00, null),
("Sweatshirt", 2.00, null),
("Tank", 2.00, null),
("Blanket", 2.00, null),
("Towel", 2.00, null),
("Leggings", 2.00, null),
("Gallery", 2.00, null),
("Pin", 0.50, null),
("ODAD-Tee", 1.00, null),
("ODAD-Sweatshirt", 1.00, null),
("ODAD-Tank", 1.00, null),
("Weekly-Tee", 1.00, null),
("Weekly-Sweatshirt", 1.00, null),
("Weekly-Tank", 1.00, null),
("Grab Bag", 0.00, null),
("Face Mask", 1.00, null),
("none", 0.00, null);
 
-- Update One
-- UPDATE `artist_profile` SET `first_name`="Henry", `last_name`="Loco" WHERE `artist_name`="locoMotive";

-- Create localhost user
-- CREATE USER 'btran'@'localhost' IDENTIFIED BY 'b^8@Hc89UgVu';
-- GRANT ALL PRIVILEGES ON artist_dashboard.* TO 'btran'@'localhost';
-- FLUSH PRIVILEGES;

-- Check User
-- SHOW GRANTS FOR 'btran'@'localhost';
-- mysql -u btran -p

-- Seed Schema
-- mysql -u btran -p < ./api/src/database/seed.sql
-- mysql -u btran -p < ./api/src/database/schema.sql

-- Fake orders so Hannah can view commissions from artist side
INSERT INTO `orders` (`order`,`order_id`, `order_created_at`, `product_title`, `variant_sku`,`vendor`, `quantity`, `product_type`, `commissions_amount`, `tags`)
VALUES
('TF733292','2469087150146','2020-09-11 15:26:02','Fury Fink-Nux','28322-tee-men-pre-cha-l','hannahfolk','1','Tee','2.00','[\"Agent - Christine\",\"Original - TF733288\",\"Reason - Order Mod\",\"Replacement\"]'),
('TF733292','2469087150146','2020-09-11 15:26:02','Spirit Players','O51109-tee-men-pre-cha-xl','hannahfolk','1','ODAD-Tee','1.00','[\"Agent - Christine\",\"Original - TF733288\",\"Reason - Order Mod\",\"Replacement\"]'),
('TF733292','2469087150146','2020-09-11 15:26:02','Fury Fink-Joe','28321-tee-men-bas-blk-l','hannahfolk','1','Tee','2.00','[\"Agent - Christine\",\"Original - TF733288\",\"Reason - Order Mod\",\"Replacement\"]'),
('TF733293','2469102092354','2020-09-11 15:33:55','Spirit Players','O51109-tee-men-hvy-cha-4xl','hannahfolk','1','ODAD-Tee','1.00','[\"Agent - Christine\",\"Original - TF733289\",\"Reason - Order Mod\",\"Replacement\"]'),
('TF733293','2469102092354','2020-09-11 15:33:55','Spirit Players','O51109-swe-uni-pul-blk-l','hannahfolk','1','ODAD-Sweatshirt','1.00','[\"Agent - Christine\",\"Original - TF733289\",\"Reason - Order Mod\",\"Replacement\"]'),
('TF733294','2469114544194','2020-09-11 15:41:58','Spirit Players','O51109-tee-men-bas-cha-2xl','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733294','2469114544194','2020-09-11 15:41:58','Princess','O51108-tee-men-bas-whi-l','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733295','2469121916994','2020-09-11 15:46:03','Black Meowgic','51106-tee-men-bas-blk-xl','hannahfolk','1','Tee','2.00','[]'),
('TF733296','2469135024194','2020-09-11 15:53:21','Spirit Players','O51109-tee-men-bas-nav-xl','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733297','2469178540098','2020-09-11 16:18:45','Princess','O51108-tee-men-bas-whi-l','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733297','2469178540098','2020-09-11 16:18:45','Aloha Neighbor','T88-AlohaNeighbor-NA','hannahfolk','1','Towel','2.00','[]'),
('TF733298','2469208621122','2020-09-11 16:36:29','Princess','O51108-tee-men-bas-blu-l','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733299','2469208784962','2020-09-11 16:36:38','Princess','O51108-stk-non-gls-whi-3x3','hannahfolk','1','ODAD-Sticker',NULL,'[]'),
('TF733301','2469227135042','2020-09-11 16:47:59','Princess','O51108-tee-wom-fit-blu-l','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733302','2469234704450','2020-09-11 16:52:16','Princess','O51108-tee-men-bas-crm-s','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733303','2469273075778','2020-09-11 17:15:14','Spirit Players','O51109-tee-men-bas-nav-m','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733304','2469277728834','2020-09-11 17:18:47','Obey Cthulhu','19007-tee-men-bas-red-xl','hannahfolk','1','Tee','2.00','[]'),
('TF733305','2469317869634','2020-09-11 17:45:26','Portrait of Greatness','18260-fmk-uni-bas-blk-os','hannahfolk','1','Face Mask','1.00','[]'),
('TF733306','2469330878530','2020-09-11 17:53:44','Spirit Players','O51109-tee-men-hvy-blk-xl','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733307','2469331861570','2020-09-11 17:54:28','Spirit Players','O51109-tee-wom-fit-blk-m','hannahfolk','1','ODAD-Tee','1.00','[]'),
('TF733308','2469348147266','2020-09-11 18:05:13','Actually In My Thirties','33105-tee-men-bas-blk-xl','hannahfolk','1','Tee','2.00','[]'),
('TF733309','2469354569794','2020-09-11 18:10:19','Princess','O51108-tan-uni-bas-whi-m','hannahfolk','1','ODAD-Tank','1.00','[]'),
('TF733310','2469356994626','2020-09-11 18:11:00','Hyrule Field National Park','26349-tee-men-pre-nav-l','hannahfolk','1','Tee','2.00','[]'),
('TF733310','2469356994626','2020-09-11 18:11:00','13th Doctor','34019-tee-wom-fit-nav-xl','hannahfolk','1','Tee','2.00','[]'),
('TF733310','2469356994626','2020-09-11 18:11:00','Magrathea Forecast','21053-tee-wom-fit-nav-xl','hannahfolk','1','Tee','2.00','[]'),
('TF733310','2469356994626','2020-09-11 18:11:00','Ghost Busted','27084-tee-men-pre-blk-l','hannahfolk','1','Tee','2.00','[]'),
('TF733311','2469359583298','2020-09-11 18:12:03','Spirit Players','O51109-tee-men-hvy-blk-2xl','hannahfolk','1','ODAD-Tee','1.00','[]');