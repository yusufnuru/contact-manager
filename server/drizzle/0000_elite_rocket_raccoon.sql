CREATE TABLE "contact_categories" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid REFERENCES auth.users(id) ON DELETE CASCADE,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"company" varchar(100),
	"contact_category_id" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_category_id_contact_categories_id_fk" FOREIGN KEY ("contact_category_id") REFERENCES "public"."contact_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_category_id_idx" ON "contact_categories" USING btree ("id");--> statement-breakpoint
CREATE INDEX "contact_category_label_idx" ON "contact_categories" USING btree ("label");--> statement-breakpoint
CREATE INDEX "contact_category_created_at_idx" ON "contact_categories" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_user_idx" ON "contacts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_category_idx" ON "contacts" USING btree ("contact_category_id");--> statement-breakpoint
CREATE INDEX "contact_name_idx" ON "contacts" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "contact_created_at_idx" ON "contacts" USING btree ("created_at");