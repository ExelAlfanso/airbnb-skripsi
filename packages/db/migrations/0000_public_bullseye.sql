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
