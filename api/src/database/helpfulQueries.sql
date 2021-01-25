
-- Get old orders with product types
SELECT `orders`.`order`, `orders`.`order_id`, `orders`.`order_created_at`, `orders`.`product_title`, 
`orders`.`vendor`, `orders`.`variant_sku`, `orders`.`quantity`, `orders`.`product_type`, 
`payouts`.`commissions_payout`, `orders`.`is_commissions_paid` 
FROM `orders` INNER JOIN  `payouts` 
ON `orders`.`product_type`=`payouts`.`product_type`
ORDER BY `order_created_at` ASC;

-- Help Joyce get commissions. 
-- Certain date range
-- Add paypal email address and international 
SELECT `orders`.`order_created_at`, `orders`.`order`, `orders`.`product_title`, `orders`.`variant_sku`,
`orders`.`vendor`, `orders`.`product_type`, `orders`.`quantity`, `orders`.`commissions_amount`, `orders`.`is_commissions_paid`, 
`artist_profile`.`paypal_email`, `artist_profile`.`is_international`
FROM `orders` INNER JOIN `artist_profile`
ON `orders`.`vendor`=`artist_profile`.`artist_name`
WHERE `order_created_at` BETWEEN 
'2020-6-29 00:00:00' AND '2020-7-05 23:59:59'
ORDER BY `order_created_at` DESC;

-- Update pending to new status in submissions
UPDATE `submissions` SET `status`="NEW" WHERE `status`="PENDING"

-- Count how many new submissions there are
SELECT count(*) as NUM FROM `submissions` WHERE `status`="NEW";

UPDATE `orders` SET `commissions_amount` = 0.50 WHERE `product_type` = "Weekly-Face Mask";
UPDATE `orders` SET `commissions_amount` = 0.50 WHERE `product_type` = "ODAD-Face Mask";

-- Help Hannah get new sample of orders from production
SELECT `orders`.`order`, `orders`.`order_created_at`, `orders`.`product_title`, `orders`.`variant_sku`,
 `orders`.`vendor`, `orders`.`quantity`, `orders`.`product_type`, 
 `orders`.`commissions_amount`, `orders`.`is_commissions_paid` 
FROM `orders` 
WHERE `order_created_at` BETWEEN
"2020-7-01 00:00:00" AND 
"2020-7-20 23:59:59" 
ORDER BY `order_created_at` DESC;

--Quickly access by artist
SELECT `artist`, `product`, `productType`, SUM(`quantity`) AS `quantity`, SUM(`paidAmount`) AS `paidAmount`, SUM(`unpaidAmount`) AS `unpaidAmount` 
FROM (SELECT `vendor` AS `artist`, `product_title` AS `product`, `product_type` AS `productType`, COUNT(`product_type`) AS `quantity`, 
IF(`is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `paidAmount`, 
IF(NOT `is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `unpaidAmount` 
FROM `orders` WHERE `order_created_at` BETWEEN '2020-6-30 00:00:00' AND '2020-06-30 23:59:59' 
GROUP BY `vendor`, `product_title`, `product_type`, `commissions_amount`, `is_commissions_paid`) AS subTable
GROUP BY `artist`, `product`, `productType`;

--Quickly access by product
SELECT `artist`, `product`, SUM(`quantity`) AS `quantity`, SUM(`paidAmount`) AS `paidAmount`, SUM(`unpaidAmount`) AS `unpaidAmount` 
FROM (SELECT `vendor` AS `artist`, `product_title` AS `product`, `product_type` AS `productType`, COUNT(`product_type`) AS `quantity`, 
IF(`is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `paidAmount`, 
IF(NOT `is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `unpaidAmount` 
FROM `orders` WHERE `order_created_at` BETWEEN '2020-6-30 00:00:00' AND '2020-06-30 23:59:59' 
GROUP BY `vendor`, `product_title`, `product_type`, `commissions_amount`, `is_commissions_paid`) AS subTable
GROUP BY `artist`, `product`;

--Quickly access by product type
SELECT `artist`, `productType`, SUM(`quantity`) AS `quantity`, SUM(`paidAmount`) AS `paidAmount`, SUM(`unpaidAmount`) AS `unpaidAmount` 
FROM (SELECT `vendor` AS `artist`, `product_title` AS `product`, `product_type` AS `productType`, COUNT(`product_type`) AS `quantity`, 
IF(`is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `paidAmount`, 
IF(NOT `is_commissions_paid`, `commissions_amount` * SUM(`quantity`), 0.00) AS `unpaidAmount` 
FROM `orders` WHERE `order_created_at` BETWEEN '2020-6-30 00:00:00' AND '2020-06-30 23:59:59' 
GROUP BY `vendor`, `product_title`, `product_type`, `commissions_amount`, `is_commissions_paid`) AS subTable
GROUP BY `artist`, `productType`;

--Find users who have an account on the artist dashboard but have not activated their account
SELECT `artist_name` AS `Arist Name`, `artist_profile`.`username_contact_email` AS `Email`, `first_name` AS `First Name`, `last_name` AS `Last Name`
FROM `users` 
INNER JOIN `artist_profile`
ON `users`.`username_contact_email`= `artist_profile`.`username_contact_email` 
WHERE `users`.`password` IS NULL;

--Inserting a kimgromoll as an artist
INSERT INTO `users` (`username_contact_email`, `is_admin`)
VALUES ("kgromoll@cfl.rr.com", false);
INSERT INTO `artist_profile` (`artist_name`, `username_contact_email`, `paypal_email`, `first_name`, `last_name`, `is_international`)
VALUES ("kimgromoll", "kgromoll@cfl.rr.com", "kgromoll@cfl.rr.com", "", "", false);