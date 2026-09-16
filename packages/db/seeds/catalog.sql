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
	),
	(
		'prop_007', 'Rumah Pantai Minimalis Canggu', 'rumah-pantai-minimalis-canggu',
		'Rumah minimalis dekat pantai dengan teras teduh, dapur lengkap, dan ruang keluarga yang nyaman.',
		'loc_bali_canggu', 'type_house', 'host_001', 980000, 4.68, 73, 5, 2, 3, 2, 0,
		'2025-01-14T08:00:00.000Z', '2025-05-14T08:00:00.000Z'
	),
	(
		'prop_008', 'Studio Cerah di Pusat Canggu', 'studio-cerah-pusat-canggu',
		'Apartemen studio dengan pencahayaan alami, dapur ringkas, dan akses mudah ke restoran lokal.',
		'loc_bali_canggu', 'type_apartment', 'host_002', 650000, 4.61, 58, 2, 1, 1, 1, 0,
		'2025-01-18T08:00:00.000Z', '2025-05-18T08:00:00.000Z'
	),
	(
		'prop_009', 'Guesthouse Tropis dekat Sawah', 'guesthouse-tropis-dekat-sawah',
		'Guesthouse sederhana dengan taman tropis, area kerja, dan suasana tenang di pinggir Canggu.',
		'loc_bali_canggu', 'type_guesthouse', 'host_003', 520000, 4.49, 35, 2, 1, 1, 1, 0,
		'2025-01-22T08:00:00.000Z', '2025-05-22T08:00:00.000Z'
	),
	(
		'prop_010', 'Villa Taman Privat Canggu', 'villa-taman-privat-canggu',
		'Villa dua kamar dengan taman privat, ruang makan terbuka, dan dapur untuk masa inap keluarga.',
		'loc_bali_canggu', 'type_villa', 'host_001', 1450000, 4.79, 96, 5, 2, 3, 2, 1,
		'2025-01-26T08:00:00.000Z', '2025-05-26T08:00:00.000Z'
	),
	(
		'prop_011', 'Rumah Loft Artistik Canggu', 'rumah-loft-artistik-canggu',
		'Rumah bergaya loft dengan interior artistik, ruang kerja, dan area bersantai di lantai atas.',
		'loc_bali_canggu', 'type_house', 'host_002', 1120000, 4.74, 81, 4, 2, 2, 2, 1,
		'2025-01-30T08:00:00.000Z', '2025-05-30T08:00:00.000Z'
	),
	(
		'prop_012', 'Apartemen Sunset dengan Balkon', 'apartemen-sunset-balkon-canggu',
		'Apartemen satu kamar dengan balkon menghadap barat, dapur, dan ruang duduk yang lapang.',
		'loc_bali_canggu', 'type_apartment', 'host_003', 790000, 4.57, 47, 3, 1, 2, 1, 0,
		'2025-02-02T08:00:00.000Z', '2025-06-02T08:00:00.000Z'
	),
	(
		'prop_013', 'Villa Taman Pinus Lembang', 'villa-taman-pinus-lembang',
		'Villa sejuk dengan taman pinus, kolam privat, dan area berkumpul untuk keluarga besar.',
		'loc_bandung_lembang', 'type_villa', 'host_001', 1520000, 4.86, 104, 8, 3, 5, 3, 1,
		'2025-02-06T08:00:00.000Z', '2025-06-06T08:00:00.000Z'
	),
	(
		'prop_014', 'Kabin Pinus dengan Perapian', 'kabin-pinus-perapian-lembang',
		'Kabin kayu di antara pohon pinus dengan perapian, dapur kecil, dan area parkir privat.',
		'loc_bandung_lembang', 'type_cabin', 'host_002', 690000, 4.82, 67, 4, 2, 2, 1, 1,
		'2025-02-10T08:00:00.000Z', '2025-06-10T08:00:00.000Z'
	),
	(
		'prop_015', 'Rumah Kebun untuk Keluarga', 'rumah-kebun-keluarga-lembang',
		'Rumah keluarga dengan kebun luas, empat kamar tidur, dan dapur yang cocok untuk memasak bersama.',
		'loc_bandung_lembang', 'type_house', 'host_003', 1180000, 4.76, 92, 9, 4, 6, 3, 1,
		'2025-02-14T08:00:00.000Z', '2025-06-14T08:00:00.000Z'
	),
	(
		'prop_016', 'Guesthouse Hangat dekat Pasar', 'guesthouse-hangat-pasar-lembang',
		'Guesthouse bersih dekat pasar lokal dengan kamar nyaman, Wi-Fi, dan tempat parkir.',
		'loc_bandung_lembang', 'type_guesthouse', 'host_001', 470000, 4.43, 29, 2, 1, 1, 1, 0,
		'2025-02-18T08:00:00.000Z', '2025-06-18T08:00:00.000Z'
	),
	(
		'prop_017', 'Apartemen Keluarga Udara Sejuk', 'apartemen-keluarga-udara-sejuk',
		'Apartemen dua kamar dengan ruang keluarga, dapur, dan pemandangan perbukitan Lembang.',
		'loc_bandung_lembang', 'type_apartment', 'host_002', 760000, 4.63, 54, 5, 2, 3, 2, 0,
		'2025-02-22T08:00:00.000Z', '2025-06-22T08:00:00.000Z'
	),
	(
		'prop_018', 'Kabin Ringkas di Kebun Teh', 'kabin-ringkas-kebun-teh',
		'Kabin ringkas untuk dua orang dengan teras menghadap kebun teh dan ruang kerja kecil.',
		'loc_bandung_lembang', 'type_cabin', 'host_003', 560000, 4.71, 41, 2, 1, 1, 1, 0,
		'2025-02-26T08:00:00.000Z', '2025-06-26T08:00:00.000Z'
	),
	(
		'prop_019', 'Villa Senja di Senggigi', 'villa-senja-senggigi',
		'Villa menghadap laut dengan kolam privat, tiga kamar, dan teras luas untuk menikmati matahari terbenam.',
		'loc_lombok_senggigi', 'type_villa', 'host_001', 1750000, 4.89, 137, 7, 3, 4, 3, 1,
		'2025-03-02T08:00:00.000Z', '2025-07-02T08:00:00.000Z'
	),
	(
		'prop_020', 'Rumah Pesisir dengan Teras', 'rumah-pesisir-teras-senggigi',
		'Rumah pesisir dengan teras lebar, dapur keluarga, dan akses berjalan kaki menuju pantai.',
		'loc_lombok_senggigi', 'type_house', 'host_002', 890000, 4.66, 62, 6, 3, 4, 2, 0,
		'2025-03-06T08:00:00.000Z', '2025-07-06T08:00:00.000Z'
	),
	(
		'prop_021', 'Apartemen Pemandangan Laut', 'apartemen-pemandangan-laut-senggigi',
		'Apartemen satu kamar dengan balkon laut, pendingin udara, dan dapur untuk masa inap singkat.',
		'loc_lombok_senggigi', 'type_apartment', 'host_003', 740000, 4.58, 51, 3, 1, 2, 1, 0,
		'2025-03-10T08:00:00.000Z', '2025-07-10T08:00:00.000Z'
	),
	(
		'prop_022', 'Guesthouse Santai dekat Pantai', 'guesthouse-santai-pantai-senggigi',
		'Guesthouse santai dengan halaman bersama, Wi-Fi, dan lokasi dekat deretan tempat makan.',
		'loc_lombok_senggigi', 'type_guesthouse', 'host_001', 490000, 4.46, 33, 2, 1, 1, 1, 0,
		'2025-03-14T08:00:00.000Z', '2025-07-14T08:00:00.000Z'
	),
	(
		'prop_023', 'Rumah Liburan untuk Grup', 'rumah-liburan-grup-senggigi',
		'Rumah luas untuk rombongan dengan empat kamar, area makan bersama, dan parkir kendaraan.',
		'loc_lombok_senggigi', 'type_house', 'host_002', 1320000, 4.73, 78, 10, 4, 7, 3, 1,
		'2025-03-18T08:00:00.000Z', '2025-07-18T08:00:00.000Z'
	),
	(
		'prop_024', 'Villa Bukit Senggigi', 'villa-bukit-senggigi',
		'Villa di kawasan perbukitan dengan dapur lengkap, ruang keluarga, dan panorama pesisir.',
		'loc_lombok_senggigi', 'type_villa', 'host_003', 1590000, 4.81, 99, 8, 3, 5, 3, 1,
		'2025-03-22T08:00:00.000Z', '2025-07-22T08:00:00.000Z'
	),
	(
		'prop_025', 'Kabin Kopi di Lembang', 'kabin-kopi-lembang',
		'Kabin kecil dekat kebun kopi dengan dapur sederhana, parkir, dan suasana tenang.',
		'loc_bandung_lembang', 'type_cabin', 'host_001', 610000, 4.69, 44, 3, 1, 2, 1, 0,
		'2025-03-26T08:00:00.000Z', '2025-07-26T08:00:00.000Z'
	),
	(
		'prop_026', 'Rumah Modern dengan Halaman', 'rumah-modern-halaman-lembang',
		'Rumah modern dengan halaman bermain, tiga kamar, dan ruang makan untuk keluarga.',
		'loc_bandung_lembang', 'type_house', 'host_002', 1060000, 4.72, 69, 7, 3, 4, 2, 0,
		'2025-03-30T08:00:00.000Z', '2025-07-30T08:00:00.000Z'
	),
	(
		'prop_027', 'Apartemen Tenang untuk Bekerja', 'apartemen-tenang-bekerja-canggu',
		'Apartemen tenang dengan meja kerja khusus, Wi-Fi, dan dapur untuk masa inap lebih panjang.',
		'loc_bali_canggu', 'type_apartment', 'host_003', 680000, 4.65, 56, 2, 1, 1, 1, 0,
		'2025-04-03T08:00:00.000Z', '2025-08-03T08:00:00.000Z'
	),
	(
		'prop_028', 'Guesthouse Kebun Canggu', 'guesthouse-kebun-canggu',
		'Guesthouse dengan kebun kecil, kamar berpendingin udara, dan akses mudah menuju pusat Canggu.',
		'loc_bali_canggu', 'type_guesthouse', 'host_001', 540000, 4.52, 38, 2, 1, 1, 1, 0,
		'2025-04-07T08:00:00.000Z', '2025-08-07T08:00:00.000Z'
	),
	(
		'prop_029', 'Villa Courtyard Canggu', 'villa-courtyard-canggu',
		'Villa dengan courtyard privat, dua kamar tidur, dapur, dan ruang keluarga terbuka.',
		'loc_bali_canggu', 'type_villa', 'host_002', 1380000, 4.84, 88, 5, 2, 3, 2, 1,
		'2025-04-11T08:00:00.000Z', '2025-08-11T08:00:00.000Z'
	),
	(
		'prop_030', 'Rumah Batu Alam Lembang', 'rumah-batu-alam-lembang',
		'Rumah bernuansa batu alam dengan perapian, dapur besar, dan parkir untuk dua kendaraan.',
		'loc_bandung_lembang', 'type_house', 'host_003', 1240000, 4.78, 83, 8, 3, 5, 3, 1,
		'2025-04-15T08:00:00.000Z', '2025-08-15T08:00:00.000Z'
	),
	(
		'prop_031', 'Guesthouse Pinus Hemat', 'guesthouse-pinus-hemat-lembang',
		'Guesthouse hemat dengan kamar bersih, Wi-Fi, tempat parkir, dan udara pegunungan yang sejuk.',
		'loc_bandung_lembang', 'type_guesthouse', 'host_001', 460000, 4.39, 24, 2, 1, 1, 1, 0,
		'2025-04-19T08:00:00.000Z', '2025-08-19T08:00:00.000Z'
	),
	(
		'prop_032', 'Kabin Keluarga di Perbukitan', 'kabin-keluarga-perbukitan-lembang',
		'Kabin keluarga dengan dua kamar, dapur, dan halaman yang menghadap perbukitan.',
		'loc_bandung_lembang', 'type_cabin', 'host_002', 830000, 4.75, 61, 5, 2, 3, 2, 0,
		'2025-04-23T08:00:00.000Z', '2025-08-23T08:00:00.000Z'
	),
	(
		'prop_033', 'Apartemen Pantai untuk Pasangan', 'apartemen-pantai-pasangan-senggigi',
		'Apartemen ringkas untuk pasangan dengan balkon, pendingin udara, dan akses dekat pantai.',
		'loc_lombok_senggigi', 'type_apartment', 'host_003', 620000, 4.54, 45, 2, 1, 1, 1, 0,
		'2025-04-27T08:00:00.000Z', '2025-08-27T08:00:00.000Z'
	),
	(
		'prop_034', 'Villa Keluarga Pesisir Lombok', 'villa-keluarga-pesisir-lombok',
		'Villa keluarga dekat pesisir dengan kolam privat, tiga kamar, dan area parkir luas.',
		'loc_lombok_senggigi', 'type_villa', 'host_001', 1820000, 4.85, 116, 8, 3, 5, 3, 1,
		'2025-05-01T08:00:00.000Z', '2025-09-01T08:00:00.000Z'
	),
	(
		'prop_035', 'Rumah Tropis dekat Marina', 'rumah-tropis-marina-senggigi',
		'Rumah tropis dengan tiga kamar, dapur lengkap, Wi-Fi, dan akses singkat menuju marina.',
		'loc_lombok_senggigi', 'type_house', 'host_002', 1010000, 4.7, 72, 6, 3, 4, 2, 0,
		'2025-05-05T08:00:00.000Z', '2025-09-05T08:00:00.000Z'
	),
	(
		'prop_036', 'Guesthouse Pesisir untuk Remote Work', 'guesthouse-pesisir-remote-work',
		'Guesthouse dekat pantai dengan ruang kerja khusus, Wi-Fi, dan suasana yang tenang.',
		'loc_lombok_senggigi', 'type_guesthouse', 'host_003', 510000, 4.48, 36, 2, 1, 1, 1, 0,
		'2025-05-09T08:00:00.000Z', '2025-09-09T08:00:00.000Z'
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
	('img_006_dining', 'prop_006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3', 'Area makan luar ruang villa pantai', 2, 0),
	('img_007_cover', 'prop_007', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', 'Rumah pantai minimalis dengan teras', 1, 1),
	('img_008_cover', 'prop_008', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', 'Studio cerah dengan ruang duduk', 1, 1),
	('img_009_cover', 'prop_009', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'Guesthouse dengan taman tropis', 1, 1),
	('img_010_cover', 'prop_010', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e', 'Villa dengan taman privat', 1, 1),
	('img_011_cover', 'prop_011', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1', 'Interior rumah loft artistik', 1, 1),
	('img_012_cover', 'prop_012', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154', 'Apartemen dengan balkon matahari terbenam', 1, 1),
	('img_013_cover', 'prop_013', 'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90', 'Villa dengan taman pinus', 1, 1),
	('img_014_cover', 'prop_014', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin pinus dengan perapian', 1, 1),
	('img_015_cover', 'prop_015', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Rumah keluarga dengan kebun', 1, 1),
	('img_016_cover', 'prop_016', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Kamar guesthouse yang hangat', 1, 1),
	('img_017_cover', 'prop_017', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'Apartemen keluarga di Lembang', 1, 1),
	('img_018_cover', 'prop_018', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin ringkas menghadap kebun teh', 1, 1),
	('img_019_cover', 'prop_019', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'Villa dengan pemandangan senja', 1, 1),
	('img_020_cover', 'prop_020', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Rumah pesisir dengan teras lebar', 1, 1),
	('img_021_cover', 'prop_021', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', 'Apartemen dengan pemandangan laut', 1, 1),
	('img_022_cover', 'prop_022', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'Guesthouse santai dekat pantai', 1, 1),
	('img_023_cover', 'prop_023', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde', 'Rumah liburan untuk rombongan', 1, 1),
	('img_024_cover', 'prop_024', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e', 'Villa di perbukitan Senggigi', 1, 1),
	('img_025_cover', 'prop_025', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin kecil dekat kebun kopi', 1, 1),
	('img_026_cover', 'prop_026', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'Rumah modern dengan halaman', 1, 1),
	('img_027_cover', 'prop_027', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154', 'Apartemen dengan ruang kerja', 1, 1),
	('img_028_cover', 'prop_028', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', 'Guesthouse dengan kebun kecil', 1, 1),
	('img_029_cover', 'prop_029', 'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90', 'Villa dengan courtyard privat', 1, 1),
	('img_030_cover', 'prop_030', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1', 'Rumah bernuansa batu alam', 1, 1),
	('img_031_cover', 'prop_031', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'Guesthouse hemat di antara pinus', 1, 1),
	('img_032_cover', 'prop_032', 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59', 'Kabin keluarga di perbukitan', 1, 1),
	('img_033_cover', 'prop_033', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'Apartemen pantai untuk pasangan', 1, 1),
	('img_034_cover', 'prop_034', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811', 'Villa keluarga dekat pesisir', 1, 1),
	('img_035_cover', 'prop_035', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', 'Rumah tropis dekat marina', 1, 1),
	('img_036_cover', 'prop_036', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'Guesthouse pesisir dengan ruang kerja', 1, 1)
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
	('prop_006', 'amenity_ac'),
	('prop_007', 'amenity_wifi'),
	('prop_007', 'amenity_kitchen'),
	('prop_007', 'amenity_parking'),
	('prop_008', 'amenity_wifi'),
	('prop_008', 'amenity_kitchen'),
	('prop_008', 'amenity_ac'),
	('prop_009', 'amenity_wifi'),
	('prop_009', 'amenity_workspace'),
	('prop_010', 'amenity_wifi'),
	('prop_010', 'amenity_kitchen'),
	('prop_010', 'amenity_ac'),
	('prop_011', 'amenity_wifi'),
	('prop_011', 'amenity_workspace'),
	('prop_011', 'amenity_ac'),
	('prop_012', 'amenity_wifi'),
	('prop_012', 'amenity_kitchen'),
	('prop_012', 'amenity_ac'),
	('prop_013', 'amenity_pool'),
	('prop_013', 'amenity_parking'),
	('prop_013', 'amenity_ac'),
	('prop_014', 'amenity_kitchen'),
	('prop_014', 'amenity_parking'),
	('prop_015', 'amenity_wifi'),
	('prop_015', 'amenity_kitchen'),
	('prop_015', 'amenity_parking'),
	('prop_016', 'amenity_wifi'),
	('prop_016', 'amenity_parking'),
	('prop_017', 'amenity_wifi'),
	('prop_017', 'amenity_kitchen'),
	('prop_018', 'amenity_wifi'),
	('prop_018', 'amenity_workspace'),
	('prop_019', 'amenity_pool'),
	('prop_019', 'amenity_parking'),
	('prop_019', 'amenity_ac'),
	('prop_020', 'amenity_wifi'),
	('prop_020', 'amenity_kitchen'),
	('prop_020', 'amenity_parking'),
	('prop_021', 'amenity_wifi'),
	('prop_021', 'amenity_kitchen'),
	('prop_021', 'amenity_ac'),
	('prop_022', 'amenity_wifi'),
	('prop_022', 'amenity_ac'),
	('prop_023', 'amenity_kitchen'),
	('prop_023', 'amenity_parking'),
	('prop_023', 'amenity_ac'),
	('prop_024', 'amenity_wifi'),
	('prop_024', 'amenity_kitchen'),
	('prop_024', 'amenity_ac'),
	('prop_025', 'amenity_kitchen'),
	('prop_025', 'amenity_parking'),
	('prop_026', 'amenity_wifi'),
	('prop_026', 'amenity_kitchen'),
	('prop_026', 'amenity_parking'),
	('prop_027', 'amenity_wifi'),
	('prop_027', 'amenity_workspace'),
	('prop_027', 'amenity_ac'),
	('prop_028', 'amenity_wifi'),
	('prop_028', 'amenity_ac'),
	('prop_029', 'amenity_wifi'),
	('prop_029', 'amenity_kitchen'),
	('prop_029', 'amenity_ac'),
	('prop_030', 'amenity_kitchen'),
	('prop_030', 'amenity_parking'),
	('prop_031', 'amenity_wifi'),
	('prop_031', 'amenity_parking'),
	('prop_032', 'amenity_wifi'),
	('prop_032', 'amenity_kitchen'),
	('prop_033', 'amenity_wifi'),
	('prop_033', 'amenity_ac'),
	('prop_034', 'amenity_pool'),
	('prop_034', 'amenity_parking'),
	('prop_034', 'amenity_ac'),
	('prop_035', 'amenity_wifi'),
	('prop_035', 'amenity_kitchen'),
	('prop_035', 'amenity_parking'),
	('prop_036', 'amenity_wifi'),
	('prop_036', 'amenity_workspace')
ON CONFLICT(`property_id`, `amenity_id`) DO NOTHING;

INSERT INTO `wishlist_states` (`property_id`, `is_wishlisted`) VALUES
	('prop_001', 0),
	('prop_002', 1),
	('prop_003', 0),
	('prop_004', 0),
	('prop_005', 1),
	('prop_006', 0),
	('prop_007', 0),
	('prop_008', 0),
	('prop_009', 0),
	('prop_010', 1),
	('prop_011', 0),
	('prop_012', 0),
	('prop_013', 0),
	('prop_014', 0),
	('prop_015', 1),
	('prop_016', 0),
	('prop_017', 0),
	('prop_018', 0),
	('prop_019', 0),
	('prop_020', 1),
	('prop_021', 0),
	('prop_022', 0),
	('prop_023', 0),
	('prop_024', 0),
	('prop_025', 1),
	('prop_026', 0),
	('prop_027', 0),
	('prop_028', 0),
	('prop_029', 0),
	('prop_030', 1),
	('prop_031', 0),
	('prop_032', 0),
	('prop_033', 0),
	('prop_034', 0),
	('prop_035', 1),
	('prop_036', 0)
ON CONFLICT(`property_id`) DO UPDATE SET
	`is_wishlisted` = excluded.`is_wishlisted`;
