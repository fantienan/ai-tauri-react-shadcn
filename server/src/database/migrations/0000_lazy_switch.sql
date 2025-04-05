CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`title` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_summary` (
	`客户编码` integer,
	`会员编码` integer,
	`访问日期` text(255),
	`访问时段` integer,
	`微信场景ID` integer,
	`PV` integer
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`attachments` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_product_details` (
	`客户编码` integer,
	`客户类型` text(255),
	`省份` text(255),
	`城市` text(255),
	`城市等级` text(255),
	`门店类型` text(255),
	`门店编码` integer,
	`会员编码` integer,
	`宝宝年龄段` text(255),
	`性别` text(255),
	`人群分类` text(255),
	`线上订单号` text(255),
	`支付日期` text(255),
	`核销日期` text(255),
	`关联订单号` text(255),
	`1级品类` text(255),
	`2级品类` text(255),
	`连带1级品类` text(255),
	`连带2级品类` text(255),
	`品牌名称` text(255),
	`连带品牌名称` text(255),
	`线上商品编码` text(255),
	`连带商品编码` text(255),
	`营销活动类型` text(255),
	`场景名称` text(255),
	`支付核销天数差` integer,
	`线上销售额` real,
	`连带销售额` real
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text(64) NOT NULL,
	`password` text(64)
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`chat_id` text NOT NULL,
	`message_id` text NOT NULL,
	`is_upvoted` integer NOT NULL,
	PRIMARY KEY(`chat_id`, `message_id`),
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action
);
