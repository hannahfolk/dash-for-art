USE artist_dashboard;

ALTER TABLE artist_profile
MODIFY COLUMN social_facebook VARCHAR(100),
MODIFY COLUMN social_instagram VARCHAR(100),
MODIFY COLUMN social_twitter VARCHAR(100),
MODIFY COLUMN social_tumblr VARCHAR(100);

ALTER TABLE submissions
ADD COLUMN email_status VARCHAR(50) NOT NULL DEFAULT "Not emailed",
ADD COLUMN email_content VARCHAR(3000);

ALTER TABLE orders
MODIFY COLUMN product_title VARCHAR(255),
MODIFY COLUMN variant_sku VARCHAR(255);

--6/30/2020
ALTER TABLE orders
CHANGE commissions_paid is_commissions_paid BOOLEAN NOT NULL DEFAULT 0;

--7/1/2020
ALTER TABLE artist_profile
MODIFY COLUMN is_international BOOLEAN NOT NULL DEFAULT 1;

--8/4/2020
ALTER TABLE submissions
ADD COLUMN logs VARCHAR(8000);

--8/10/2020
ALTER TABLE orders
ADD COLUMN tags VARCHAR(150);

--8/25/2020
ALTER TABLE submissions
MODIFY COLUMN logs TEXT;

--8/31/2020
ALTER TABLE submissions
ADD COLUMN email_color VARCHAR(30) DEFAULT '{"color": "#6a6a6a"}';

--9/21/2020
ALTER TABLE payouts
ADD COLUMN `group` VARCHAR(50);