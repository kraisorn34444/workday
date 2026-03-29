CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64),
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"username" varchar(64),
	"password" varchar(255),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "workRecordImages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workRecordImages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recordId" integer NOT NULL,
	"filename" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"uploadedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workRecords" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "workRecords_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"date" varchar(10) NOT NULL,
	"month" varchar(10) NOT NULL,
	"customerName" text,
	"customerPhone" varchar(20),
	"product" text,
	"os" text,
	"serviceType" text,
	"details" text,
	"notes" text,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workRecordImages" ADD CONSTRAINT "workRecordImages_recordId_workRecords_id_fk" FOREIGN KEY ("recordId") REFERENCES "public"."workRecords"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workRecords" ADD CONSTRAINT "workRecords_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;