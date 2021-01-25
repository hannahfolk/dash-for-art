-- Insert Test Artist Account
INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `is_international`) 
VALUES ("locoMotive", "Tom", "Thomas", "bryan89tran@yahoo.com", "bryan89tran@yahoo.com", "", "", "", "",  true);

INSERT INTO `users` (`username_contact_email`)
VALUES ("bryan89tran@yahoo.com");

-- Insert Admin accounts
INSERT INTO `users` (`username_contact_email`, `is_admin`)
VALUES ("btran@teefury.com", true),
("lance@digmeepartners.com", true),
("chris@digmeepartners.com", true),
("ppatel@digmeepartners.com", true),
("marissa@teefury.com", true),
("psandoval@teefury.com", true),
("ithiessen@teefury.com", true),
("rminjares@teefury.com", true),
("joyce@teefury.com", true);

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
