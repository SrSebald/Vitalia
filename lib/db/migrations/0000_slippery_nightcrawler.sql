CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid,
	"name" text NOT NULL,
	"muscle_group" text,
	"equipment" text,
	"description" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mood_logs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mood_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"mood_rating" integer NOT NULL,
	"notes" text,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mood_rating_range" CHECK ("mood_logs"."mood_rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "nutrition_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"consumed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"meal_type" text,
	"food_item" text NOT NULL,
	"serving_size" text,
	"calories" integer,
	"protein_g" numeric(6, 2),
	"carbs_g" numeric(6, 2),
	"fat_g" numeric(6, 2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calories_positive" CHECK ("nutrition_logs"."calories" IS NULL OR "nutrition_logs"."calories" >= 0)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"auth_user_id" uuid NOT NULL,
	"full_name" text,
	"username" text,
	"height_cm" numeric(5, 2),
	"weight_kg" numeric(5, 2),
	"date_of_birth" date,
	"fitness_goals" text,
	"activity_level" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "height_positive" CHECK ("profiles"."height_cm" IS NULL OR "profiles"."height_cm" > 0),
	CONSTRAINT "weight_positive" CHECK ("profiles"."weight_kg" IS NULL OR "profiles"."weight_kg" > 0)
);
--> statement-breakpoint
CREATE TABLE "progress_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"caption" text,
	"taken_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid,
	"set_order" integer,
	"reps" integer,
	"weight_kg" numeric(6, 2),
	"distance_m" numeric(8, 2),
	"duration_sec" integer,
	"intensity" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reps_positive" CHECK ("sets"."reps" IS NULL OR "sets"."reps" > 0),
	CONSTRAINT "weight_positive" CHECK ("sets"."weight_kg" IS NULL OR "sets"."weight_kg" >= 0),
	CONSTRAINT "distance_positive" CHECK ("sets"."distance_m" IS NULL OR "sets"."distance_m" >= 0),
	CONSTRAINT "duration_positive" CHECK ("sets"."duration_sec" IS NULL OR "sets"."duration_sec" >= 0)
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"workout_date" date DEFAULT current_date NOT NULL,
	"duration_min" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "duration_positive" CHECK ("workouts"."duration_min" IS NULL OR "workouts"."duration_min" > 0)
);
--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mood_logs" ADD CONSTRAINT "mood_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_logs" ADD CONSTRAINT "nutrition_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_photos" ADD CONSTRAINT "progress_photos_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sets" ADD CONSTRAINT "sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "exercises_name_key" ON "exercises" USING btree ("name");--> statement-breakpoint
CREATE INDEX "mood_logs_user_id_idx" ON "mood_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "nutrition_logs_user_id_idx" ON "nutrition_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "nutrition_logs_consumed_at_idx" ON "nutrition_logs" USING btree ("consumed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "progress_photos_user_id_idx" ON "progress_photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sets_workout_id_idx" ON "sets" USING btree ("workout_id");--> statement-breakpoint
CREATE INDEX "sets_exercise_id_idx" ON "sets" USING btree ("exercise_id");