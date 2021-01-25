USE `artist_dashboard`;

-- Admin users
INSERT INTO `users` (`username_contact_email`, `is_admin`)
VALUES ("btran@teefury.com", true),
("lance@digmeepartners.com", true),
("chris@digmeepartners.com", true),
("ppatel@digmeepartners.com", true),
("marissa@teefury.com", true),
("psandoval@teefury.com", true),
("ithiessen@teefury.com", true),
("rminjares@teefury.com", true),
("joyce@teefury.com", true),
("hfolk@teefury.com", true);

-- Artist users
INSERT INTO `users` (`username_contact_email`, `password`, `is_admin`)
VALUES ("artist-btran@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-lance@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-chris@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-ppatel@digmeepartners.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-marissa@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-psandoval@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-ithiessen@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK",  false),
("artist-rminjares@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-joyce@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false),
("artist-hfolk@teefury.com", "$2b$10$z491qJsDhk6/y4hhEoy0Q.xJVH3QmAwwwH3j3N4GOjENFTDfzmImK", false);

-- Artist accounts
INSERT INTO `artist_profile` (`artist_name`, `first_name`, `last_name`, `username_contact_email`, `paypal_email`, `phone`, `social_facebook`, `social_instagram`, `social_twitter`, `is_international`)
VALUES ("Raffiti", "Bryan", "Tran", "artist-btran@teefury.com", "artist-btran@teefury.com", "", "", "", "", false),
("DoOomcat", "Lance", "Stern", "artist-lance@digmeepartners.com", "artist-lance@digmeepartners.com", "", "", "", "", false),
("xMorfina", "Chris", "Beason", "artist-chris@digmeepartners.com", "chris@digmeepartners.com", "", "", "", "", false),
("Kat_Haynes", "Parul", "Patel", "artist-ppatel@digmeepartners.com", "ppatel@digmeepartners.com", "", "", "", "", false),
("vp021", "Marissa", "Tucker", "artist-marissa@teefury.com", "marissa@teefury.com",  "", "", "", "", false),
("otisframpton", "Pedro", "Sandoval", "artist-psandoval@teefury.com", "psandoval@teefury.com",  "", "", "", "", false),
("eduely", "Isabel", "Thiessen", "artist-ithiessen@teefury.com", "ithiessen@teefury.com",  "", "", "", "", false),
("beware1984", "Rebecca", "Minajares", "artist-rminjares@teefury.com", "rminjares@teefury.com", "", "", "", "", false),
("Geekydog", "Joyce", "Armstrong", "artist-joyce@teefury.com", "joyce@teefury.com", "", "", "", "", false),
("vp021", "Hannah", "Folk", "artist-hfolk@teefury.com", "hfolk@teefury.com",  "", "", "", "", false);


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

-- lance@digmeepartners.com
-- chris@digmeepartners.com
-- ppatel@digmeepartners.com
-- marissa@teefury.com
-- psandoval@teefury.com
-- ithiessen@teefury.com
-- rminjares@teefury.com
-- joyce@teefury.com


-- artist-btran@teefury.com          - Raffiti 
-- artist-lance@digmeepartners.com   - DoOomcat 
-- artist-chris@digmeepartners.com   - xMorfina 
-- artist-ppatel@digmeepartners.com  - Kat_Haynes 
-- artist-marissa@teefury.com        - vp021 
-- artist-psandoval@teefury.com      - otisframpton 
-- artist-ithiessen@teefury.com      - eduely 
-- artist-rminjares@teefury.com      - beware1984 
-- artist-joyce@teefury.com          - Geekydog 
