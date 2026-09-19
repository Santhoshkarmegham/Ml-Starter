CREATE TABLE `lesson_progress` (
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`completed_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `lesson_id`)
);
