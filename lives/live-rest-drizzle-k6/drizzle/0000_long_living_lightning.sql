CREATE TABLE IF NOT EXISTS "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"task" varchar(255) NOT NULL,
	"description" text,
	"is_done" boolean DEFAULT false,
	"due_date" timestamp,
	"done_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
