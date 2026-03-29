import { pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Define enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "cancelled"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  username: varchar("username", { length: 64 }).unique(),
  password: varchar("password", { length: 255 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Work Records Table
export const workRecords = pgTable("workRecords", {
  id: serial("id").primaryKey(),
  userId: serial("userId").notNull().references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  month: varchar("month", { length: 10 }).notNull(), // ม.ค., ก.พ., มี.ค., etc.
  customerName: text("customerName"),
  customerPhone: varchar("customerPhone", { length: 20 }),
  product: text("product"),
  os: text("os"),
  serviceType: text("serviceType"),
  details: text("details"),
  notes: text("notes"),
  status: statusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type WorkRecord = typeof workRecords.$inferSelect;
export type InsertWorkRecord = typeof workRecords.$inferInsert;

// Work Record Images Table
export const workRecordImages = pgTable("workRecordImages", {
  id: serial("id").primaryKey(),
  recordId: serial("recordId").notNull().references(() => workRecords.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type WorkRecordImage = typeof workRecordImages.$inferSelect;
export type InsertWorkRecordImage = typeof workRecordImages.$inferInsert;
