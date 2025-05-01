CREATE TABLE `dashboard` (
	`chat_id` text NOT NULL,
	`message_id` text NOT NULL,
	`created_at` text NOT NULL,
	`user_id` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`chat_id`, `message_id`),
	FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`message_id`) REFERENCES `message`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
