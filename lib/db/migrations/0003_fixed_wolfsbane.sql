ALTER TABLE "profiles" ADD COLUMN "body_type" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "main_goal" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "goal_deadline" date;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "motivation" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "health_conditions" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "allergies" text[];--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "diet_type" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "meal_schedule" text;