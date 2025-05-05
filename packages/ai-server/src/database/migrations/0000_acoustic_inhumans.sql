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
CREATE TABLE `analyze_daily_summary` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_code` integer NOT NULL,
	`member_code` integer NOT NULL,
	`visit_date` text(255) NOT NULL,
	`visit_time_period` integer NOT NULL,
	`weixin_id` integer NOT NULL,
	`pv` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analyze_order_product_details` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_code` integer NOT NULL,
	`custormer_type` text(255) NOT NULL,
	`province` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`city_level` text(255) NOT NULL,
	`store_type` text(255) NOT NULL,
	`store_code` integer NOT NULL,
	`custromer_code` integer NOT NULL,
	`baby_age_group` text(255) NOT NULL,
	`gender` text(255) NOT NULL,
	`crowd_type` text(255) NOT NULL,
	`online_order` text(255) NOT NULL,
	`payment_date` text(255) NOT NULL,
	`write_off_date` text(255),
	`associated_order_number` text(255),
	`first_category` text(255) NOT NULL,
	`secondary_category` text(255) NOT NULL,
	`related_first_category` text(255) NOT NULL,
	`related_secondary_category` text(255) NOT NULL,
	`brand_name` text(255),
	`related_brand_name` text(255),
	`online_commodity_code` text(255) NOT NULL,
	`related_online_commodity_code` text(255),
	`marketing_campaign_type` text(255) NOT NULL,
	`scene_name` text(255) NOT NULL,
	`payment_write_off_days_difference` integer,
	`online_sales` real NOT NULL,
	`related_sales` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dashboard` (
	`chat_id` text NOT NULL,
	`message_id` text NOT NULL,
	`created_at` text NOT NULL,
	`user_id` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`chat_id`, `message_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);

*/