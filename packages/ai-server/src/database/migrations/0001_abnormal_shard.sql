CREATE TABLE `metadata_info` (
	`column_name` text NOT NULL,
	`column_aliases` text NOT NULL,
	`column_type` text NOT NULL,
	`is_nullable` integer NOT NULL,
	`column_default` text,
	`table_name` text NOT NULL,
	`table_aliases` text NOT NULL
);
