-- Deterministic dummy data shared by both thesis frontends.
-- Alchemy imports this file after all Drizzle migrations have run.

INSERT INTO `locations` (`id`, `city`, `province`, `country`, `display_name`) VALUES
	('loc_bali_canggu', 'Canggu', 'Bali', 'Indonesia', 'Canggu, Bali'),
	('loc_bandung_lembang', 'Lembang', 'Jawa Barat', 'Indonesia', 'Lembang, Jawa Barat'),
	('loc_yogyakarta_kaliurang', 'Kaliurang', 'DI Yogyakarta', 'Indonesia', 'Kaliurang, Yogyakarta'),
	('loc_lombok_senggigi', 'Senggigi', 'Nusa Tenggara Barat', 'Indonesia', 'Senggigi, Lombok')
ON CONFLICT(`id`) DO UPDATE SET
	`city` = excluded.`city`,
	`province` = excluded.`province`,
	`country` = excluded.`country`,
	`display_name` = excluded.`display_name`;
INSERT INTO `property_types` (`id`, `name`, `slug`) VALUES
	('type_villa', 'Villa', 'villa'),
	('type_apartment', 'Apartment', 'apartment'),
	('type_house', 'House', 'house'),
	('type_cabin', 'Cabin', 'cabin'),
	('type_guesthouse', 'Guesthouse', 'guesthouse')
ON CONFLICT(`id`) DO UPDATE SET
	`name` = excluded.`name`,
	`slug` = excluded.`slug`;
INSERT INTO `hosts` (`id`, `name`, `avatar_url`, `joined_year`, `is_superhost`) VALUES
	('host_001', 'Made Pratama', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 2019, 1),
	('host_002', 'Ayu Lestari', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 2020, 1),
	('host_003', 'Raka Wibowo', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', 2021, 0)
ON CONFLICT(`id`) DO UPDATE SET
	`name` = excluded.`name`,
	`avatar_url` = excluded.`avatar_url`,
	`joined_year` = excluded.`joined_year`,
	`is_superhost` = excluded.`is_superhost`;
INSERT INTO `amenities` (`id`, `name`, `icon_name`) VALUES
	('amenity_pool', 'Private Pool', 'waves'),
	('amenity_wifi', 'Wi-Fi', 'wifi'),
	('amenity_kitchen', 'Kitchen', 'utensils'),
	('amenity_parking', 'Free Parking', 'car'),
	('amenity_ac', 'Air Conditioning', 'snowflake'),
	('amenity_workspace', 'Dedicated Workspace', 'laptop')
ON CONFLICT(`id`) DO UPDATE SET
	`name` = excluded.`name`,
	`icon_name` = excluded.`icon_name`;
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
	)
ON CONFLICT(`id`) DO UPDATE SET
	`title` = excluded.`title`,
	`slug` = excluded.`slug`,
	`description` = excluded.`description`,
	`location_id` = excluded.`location_id`,
	`property_type_id` = excluded.`property_type_id`,
	`host_id` = excluded.`host_id`,
	`price_per_night` = excluded.`price_per_night`,
	`rating` = excluded.`rating`,
	`review_count` = excluded.`review_count`,
	`max_guests` = excluded.`max_guests`,
	`bedrooms` = excluded.`bedrooms`,
	`beds` = excluded.`beds`,
	`bathrooms` = excluded.`bathrooms`,
	`is_guest_favorite` = excluded.`is_guest_favorite`,
	`created_at` = excluded.`created_at`,
	`updated_at` = excluded.`updated_at`;
INSERT INTO `property_images` (`id`, `property_id`, `image_url`, `alt_text`, `sort_order`, `is_cover`) VALUES
	('img_001_cover', 'prop_001', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'Tampilan depan villa tropis dengan kolam renang', 1, 1),
	('img_001_living', 'prop_001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'Ruang keluarga villa tropis', 2, 0),
	('img_002_cover', 'prop_002', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'Apartemen modern dengan balkon', 1, 1),
	('img_003_cover', 'prop_003', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Rumah keluarga dengan halaman hijau', 1, 1),
	('img_004_cover', 'prop_004', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin kayu di area pegunungan', 1, 1),
	('img_005_cover', 'prop_005', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Kamar guesthouse dengan meja kerja', 1, 1),
	('img_006_cover', 'prop_006', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Villa pantai dengan kolam renang', 1, 1),
	('img_006_dining', 'prop_006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', 'Area makan luar ruang villa pantai', 2, 0)
ON CONFLICT(`id`) DO UPDATE SET
	`property_id` = excluded.`property_id`,
	`image_url` = excluded.`image_url`,
	`alt_text` = excluded.`alt_text`,
	`sort_order` = excluded.`sort_order`,
	`is_cover` = excluded.`is_cover`;
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
	('prop_006', 'amenity_ac')
ON CONFLICT(`property_id`, `amenity_id`) DO NOTHING;

INSERT INTO `wishlist_states` (`property_id`, `is_wishlisted`) VALUES
	('prop_001', 0),
	('prop_002', 1),
	('prop_003', 0),
	('prop_004', 0),
	('prop_005', 1),
	('prop_006', 0)
ON CONFLICT(`property_id`) DO UPDATE SET
	`is_wishlisted` = excluded.`is_wishlisted`;
