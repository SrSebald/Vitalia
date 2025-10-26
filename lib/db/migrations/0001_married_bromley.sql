CREATE TABLE "ai_generated_workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"goals" text[] NOT NULL,
	"muscle_groups" text[] NOT NULL,
	"duration" text NOT NULL,
	"energy_level" text NOT NULL,
	"estimated_duration" text NOT NULL,
	"workout_data" text NOT NULL,
	"additional_notes" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_generated_workouts" ADD CONSTRAINT "ai_generated_workouts_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_generated_workouts_user_id_idx" ON "ai_generated_workouts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_generated_workouts_created_at_idx" ON "ai_generated_workouts" USING btree ("created_at");