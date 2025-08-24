CREATE TABLE `attributes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`index` text NOT NULL,
	`attribute_ids` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`type_id` text,
	FOREIGN KEY (`parent_id`) REFERENCES `nodes`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`type_id`) REFERENCES `node_types`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `node_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`defined_attribute_names` text NOT NULL
);
