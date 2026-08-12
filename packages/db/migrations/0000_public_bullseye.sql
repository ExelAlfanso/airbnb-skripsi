CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `amenities_name_idx` ON `amenities` (`name`);--> statement-breakpoint
CREATE TABLE `hosts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text NOT NULL,
	`joined_year` integer NOT NULL,
	`is_superhost` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`city` text NOT NULL,
	`province` text NOT NULL,
	`country` text NOT NULL,
	`display_name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `locations_city_idx` ON `locations` (`city`);--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`location_id` text NOT NULL,
	`property_type_id` text NOT NULL,
	`host_id` text NOT NULL,
	`price_per_night` integer NOT NULL,
	`rating` real NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`max_guests` integer NOT NULL,
	`bedrooms` integer NOT NULL,
	`beds` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`is_guest_favorite` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`property_type_id`) REFERENCES `property_types`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`host_id`) REFERENCES `hosts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_slug_idx` ON `properties` (`slug`);--> statement-breakpoint
CREATE INDEX `properties_location_idx` ON `properties` (`location_id`);--> statement-breakpoint
CREATE INDEX `properties_type_idx` ON `properties` (`property_type_id`);--> statement-breakpoint
CREATE INDEX `properties_price_idx` ON `properties` (`price_per_night`);--> statement-breakpoint
CREATE INDEX `properties_rating_idx` ON `properties` (`rating`);--> statement-breakpoint
CREATE TABLE `property_amenities` (
	`property_id` text NOT NULL,
	`amenity_id` text NOT NULL,
	PRIMARY KEY(`property_id`, `amenity_id`),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `property_amenities_amenity_idx` ON `property_amenities` (`amenity_id`);--> statement-breakpoint
CREATE TABLE `property_images` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`image_url` text NOT NULL,
	`alt_text` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_cover` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `property_images_property_order_idx` ON `property_images` (`property_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `property_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `property_types_slug_idx` ON `property_types` (`slug`);--> statement-breakpoint
INSERT INTO `locations` (`id`, `city`, `province`, `country`, `display_name`) VALUES
	('loc_bali_canggu', 'Canggu', 'Bali', 'Indonesia', 'Canggu, Bali'),
	('loc_bandung_lembang', 'Lembang', 'Jawa Barat', 'Indonesia', 'Lembang, Jawa Barat'),
	('loc_yogyakarta_kaliurang', 'Kaliurang', 'DI Yogyakarta', 'Indonesia', 'Kaliurang, Yogyakarta'),
	('loc_lombok_senggigi', 'Senggigi', 'Nusa Tenggara Barat', 'Indonesia', 'Senggigi, Lombok');
--> statement-breakpoint
INSERT INTO `property_types` (`id`, `name`, `slug`) VALUES
	('type_villa', 'Villa', 'villa'),
	('type_apartment', 'Apartment', 'apartment'),
	('type_house', 'House', 'house'),
	('type_cabin', 'Cabin', 'cabin'),
	('type_guesthouse', 'Guesthouse', 'guesthouse');
--> statement-breakpoint
INSERT INTO `hosts` (`id`, `name`, `avatar_url`, `joined_year`, `is_superhost`) VALUES
	('host_001', 'Made Pratama', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 2019, 1),
	('host_002', 'Ayu Lestari', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 2020, 1),
	('host_003', 'Raka Wibowo', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', 2021, 0);
--> statement-breakpoint
INSERT INTO `amenities` (`id`, `name`, `icon_name`) VALUES
	('amenity_pool', 'Private Pool', 'waves'),
	('amenity_wifi', 'Wi-Fi', 'wifi'),
	('amenity_kitchen', 'Kitchen', 'utensils'),
	('amenity_parking', 'Free Parking', 'car'),
	('amenity_ac', 'Air Conditioning', 'snowflake'),
	('amenity_workspace', 'Dedicated Workspace', 'laptop');
--> statement-breakpoint
INSERT INTO `properties` (
	`id`, `title`, `slug`, `description`, `location_id`, `property_type_id`, `host_id`,
	`price_per_night`, `rating`, `review_count`, `max_guests`, `bedrooms`, `beds`,
	`bathrooms`, `is_guest_favorite`, `created_at`, `updated_at`
) VALUES
	(
		'prop_001', 'Villa Tropis dengan Kolam Renang', 'villa-tropis-kolam-renang',
		'Villa tropis untuk keluarga dengan area terbuka, kolam renang pribadi, dan akses mudah ke pusat Canggu.',
		'loc_bali_canggu', 'type_villa', 'host_001', 1250000, 4.87, 128, 6, 3, 3, 2, 1,
		'2025-01-12T08:00:00.000Z', '2025-04-18T08:00:00.000Z'
	),
	(
		'prop_002', 'Apartemen Modern Dekat Pantai', 'apartemen-modern-dekat-pantai',
		'Apartemen ringkas dengan balkon, dapur lengkap, dan akses cepat ke area pantai serta kafe populer.',
		'loc_bali_canggu', 'type_apartment', 'host_002', 720000, 4.72, 86, 3, 1, 2, 1, 0,
		'2025-02-04T08:00:00.000Z', '2025-04-10T08:00:00.000Z'
	),
	(
		'prop_003', 'Rumah Keluarga di Udara Sejuk Lembang', 'rumah-keluarga-udara-sejuk-lembang',
		'Rumah luas dengan halaman, dapur keluarga, dan pemandangan perbukitan untuk liburan kelompok.',
		'loc_bandung_lembang', 'type_house', 'host_003', 950000, 4.64, 64, 8, 4, 5, 3, 1,
		'2025-01-28T08:00:00.000Z', '2025-03-22T08:00:00.000Z'
	),
	(
		'prop_004', 'Kabin Kayu Tenang di Kaliurang', 'kabin-kayu-tenang-kaliurang',
		'Kabin kayu hangat untuk pasangan atau keluarga kecil, dekat jalur alam dan area wisata Kaliurang.',
		'loc_yogyakarta_kaliurang', 'type_cabin', 'host_002', 580000, 4.91, 42, 4, 2, 2, 1, 1,
		'2025-03-03T08:00:00.000Z', '2025-05-01T08:00:00.000Z'
	),
	(
		'prop_005', 'Guesthouse Nyaman untuk Remote Work', 'guesthouse-nyaman-remote-work',
		'Guesthouse tenang dengan Wi-Fi cepat, ruang kerja khusus, dan akses mudah ke pusat Lembang.',
		'loc_bandung_lembang', 'type_guesthouse', 'host_001', 430000, 4.55, 39, 2, 1, 1, 1, 0,
		'2025-02-17T08:00:00.000Z', '2025-04-09T08:00:00.000Z'
	),
	(
		'prop_006', 'Villa Pantai Senggigi untuk Grup', 'villa-pantai-senggigi-grup',
		'Villa tepi pantai dengan empat kamar, kolam pribadi, dan area makan luar ruang untuk grup besar.',
		'loc_lombok_senggigi', 'type_villa', 'host_003', 1680000, 4.83, 111, 10, 4, 6, 4, 1,
		'2025-01-06T08:00:00.000Z', '2025-05-11T08:00:00.000Z'
	);
--> statement-breakpoint
INSERT INTO `property_images` (`id`, `property_id`, `image_url`, `alt_text`, `sort_order`, `is_cover`) VALUES
	('img_001_cover', 'prop_001', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'Tampilan depan villa tropis dengan kolam renang', 1, 1),
	('img_001_living', 'prop_001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'Ruang keluarga villa tropis', 2, 0),
	('img_002_cover', 'prop_002', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'Apartemen modern dengan balkon', 1, 1),
	('img_003_cover', 'prop_003', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Rumah keluarga dengan halaman hijau', 1, 1),
	('img_004_cover', 'prop_004', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin kayu di area pegunungan', 1, 1),
	('img_005_cover', 'prop_005', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Kamar guesthouse dengan meja kerja', 1, 1),
	('img_006_cover', 'prop_006', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Villa pantai dengan kolam renang', 1, 1),
	('img_006_dining', 'prop_006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', 'Area makan luar ruang villa pantai', 2, 0);
--> statement-breakpoint
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
	('prop_001', 'amenity_pool'),
	('prop_001', 'amenity_wifi'),
	('prop_001', 'amenity_kitchen'),
	('prop_001', 'amenity_ac'),
	('prop_002', 'amenity_wifi'),
	('prop_002', 'amenity_kitchen'),
	('prop_002', 'amenity_ac'),
	('prop_003', 'amenity_wifi'),
	('prop_003', 'amenity_kitchen'),
	('prop_003', 'amenity_parking'),
	('prop_004', 'amenity_wifi'),
	('prop_004', 'amenity_parking'),
	('prop_005', 'amenity_wifi'),
	('prop_005', 'amenity_workspace'),
	('prop_006', 'amenity_pool'),
	('prop_006', 'amenity_wifi'),
	('prop_006', 'amenity_kitchen'),
	('prop_006', 'amenity_parking'),
	('prop_006', 'amenity_ac');
