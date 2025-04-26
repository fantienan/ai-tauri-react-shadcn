-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `vote` (
	`chat_id` text NOT NULL,
	`message_id` text NOT NULL,
	`is_upvoted` integer NOT NULL,
	PRIMARY KEY(`chat_id`, `message_id`),
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`title` text NOT NULL,
	`user_id` text NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`attachments` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(64) NOT NULL,
	`password` text(64),
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `daily_summary` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_code` integer,
	`member_code` integer,
	`visit_date` text(255),
	`visit_time_period` integer,
	`weixin_id` integer,
	`pv` integer
);
--> statement-breakpoint
CREATE TABLE `order_product_details` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_code` integer,
	`custormer_type` text(255),
	`province` text(255),
	`city` text(255),
	`city_level` text(255),
	`store_type` text(255),
	`store_code` integer,
	`custromer_code` integer,
	`baby_age_group` text(255),
	`gender` text(255),
	`crowd_type` text(255),
	`online_order` text(255),
	`payment_date` text(255),
	`write_off_date` text(255),
	`associated_order_number` text(255),
	`first_category` text(255),
	`secondary_category` text(255),
	`related_first_category` text(255),
	`related_secondary_category` text(255),
	`brand_name` text(255),
	`related_brand_name` text(255),
	`online_commodity_code` text(255),
	`related_online_commodity_code` text(255),
	`marketing_campaign_type` text(255),
	`scene_name` text(255),
	`payment_write_off_days_difference` integer,
	`online_sales` real,
	`related_sales` real
);

*/