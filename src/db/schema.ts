import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  image: text("image").notNull(),
  location: text("location").notNull(),
  author: text("author").notNull(),
  readMinutes: integer("read_minutes").notNull().default(4),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: false }).notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  startsAt: timestamp("starts_at", { withTimezone: false }).notNull(),
  timeLabel: varchar("time_label", { length: 60 }).notNull(),
  location: text("location").notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  year: varchar("year", { length: 10 }).notNull().default("2026"),
  location: text("location").notNull().default("Colombo Campus"),
  aspect: varchar("aspect", { length: 20 }).notNull().default("landscape"),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: varchar("department", { length: 60 }).notNull(),
  qualification: text("qualification").notNull(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(100),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  inquiryType: varchar("inquiry_type", { length: 50 }).notNull(),
  grade: varchar("grade", { length: 30 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type StaffMember = typeof staff.$inferSelect;
