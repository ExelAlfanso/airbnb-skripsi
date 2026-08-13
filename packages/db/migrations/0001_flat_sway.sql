CREATE TABLE `wishlist_states` (
	`property_id` text PRIMARY KEY NOT NULL,
	`is_wishlisted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
