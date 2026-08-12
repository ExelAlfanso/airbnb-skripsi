CREATE TABLE `wishlist_states` (
	`property_id` text PRIMARY KEY NOT NULL,
	`is_wishlisted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `wishlist_states` (`property_id`, `is_wishlisted`) VALUES
	('prop_001', 0),
	('prop_002', 1),
	('prop_003', 0),
	('prop_004', 0),
	('prop_005', 1),
	('prop_006', 0);
