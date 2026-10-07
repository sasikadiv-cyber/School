import {
  boolean,
  integer,
  jsonb,
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
  sortOrder: integer("sort_order").notNull().default(0),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: varchar("department", { length: 60 }).notNull(),
  qualification: text("qualification").notNull(),
  image: text("image"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(100),
});

/** Per-unit image archives for cadeting detail pages. */
export const unitGalleryItems = pgTable("unit_gallery_items", {
  id: serial("id").primaryKey(),
  unitSlug: varchar("unit_slug", { length: 80 }).notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  caption: text("caption").notNull().default(""),
  aspect: varchar("aspect", { length: 20 }).notNull().default("landscape"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

/** Reusable Framer-style blocks inserted by the visual component library. */
export const visualBlocks = pgTable("visual_blocks", {
  id: serial("id").primaryKey(),
  pagePath: varchar("page_path", { length: 240 }).notNull(),
  blockType: varchar("block_type", { length: 40 }).notNull(),
  draftData: jsonb("draft_data").$type<Record<string, string>>().notNull(),
  publishedData: jsonb("published_data").$type<Record<string, string>>().notNull(),
  draftHidden: boolean("draft_hidden").notNull().default(false),
  publishedHidden: boolean("published_hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(100),
  updatedBy: integer("updated_by"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
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

/** Booked appointments with a college department. */
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  department: varchar("department", { length: 80 }).notNull(),
  visitDate: varchar("visit_date", { length: 20 }).notNull(),
  visitTime: varchar("visit_time", { length: 20 }).notNull(),
  purpose: text("purpose").notNull(),
  visitors: varchar("visitors", { length: 20 }).notNull().default("1"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

/** Admission applications (Grade 6 intake and Advanced Level). */
export const admissionApplications = pgTable("admission_applications", {
  id: serial("id").primaryKey(),
  programme: varchar("programme", { length: 20 }).notNull(),
  studentName: text("student_name").notNull(),
  dob: varchar("dob", { length: 20 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  guardianName: text("guardian_name").notNull(),
  relationship: varchar("relationship", { length: 30 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  currentSchool: text("current_school").notNull(),
  // Grade 6 intake
  currentGrade: varchar("current_grade", { length: 20 }),
  // Advanced Level
  stream: varchar("stream", { length: 40 }),
  olYear: varchar("ol_year", { length: 10 }),
  olResults: text("ol_results"),
  olIndex: varchar("ol_index", { length: 20 }),
  // Shared
  medium: varchar("medium", { length: 20 }).notNull().default("Sinhala"),
  siblingName: text("sibling_name"),
  fatherOldThomian: varchar("father_old_thomian", { length: 10 }),
  fatherYears: varchar("father_years", { length: 20 }),
  housePreference: varchar("house_preference", { length: 20 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: false })
    .notNull()
    .defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type UnitGalleryItem = typeof unitGalleryItems.$inferSelect;
export type VisualBlock = typeof visualBlocks.$inferSelect;
// ─────────────────────────────────────────────────────────────────────────────
// Admin CMS — Phase 1
// ─────────────────────────────────────────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 30 }).notNull().default("super_admin"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: false }),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const cmsPages = pgTable("cms_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("published"),
  updatedBy: integer("updated_by"),
  publishedAt: timestamp("published_at", { withTimezone: false }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export const cmsSections = pgTable("cms_sections", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("page_slug", { length: 80 }).notNull(),
  sectionKey: varchar("section_key", { length: 80 }).notNull(),
  label: text("label").notNull(),
  sectionType: varchar("section_type", { length: 40 }).notNull(),
  draftData: jsonb("draft_data").$type<Record<string, string>>().notNull(),
  publishedData: jsonb("published_data").$type<Record<string, string>>().notNull(),
  draftHidden: boolean("draft_hidden").notNull().default(false),
  publishedHidden: boolean("published_hidden").notNull().default(false),
  draftOrder: integer("draft_order").notNull().default(0),
  publishedOrder: integer("published_order").notNull().default(0),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export const cmsRevisions = pgTable("cms_revisions", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("page_slug", { length: 80 }).notNull(),
  snapshot: jsonb("snapshot").$type<unknown>().notNull(),
  action: varchar("action", { length: 30 }).notNull(),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  draftValue: jsonb("draft_value").$type<unknown>().notNull(),
  publishedValue: jsonb("published_value").$type<unknown>().notNull(),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 80 }).notNull(),
  entityId: text("entity_id"),
  details: jsonb("details").$type<unknown>(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

/** Persistent custom collections/categories for Phase 2 content managers. */
export const contentCollections = pgTable("content_collections", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 30 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

/** Universal element-level visual edits for every public page. */
export const visualPatches = pgTable("visual_patches", {
  id: serial("id").primaryKey(),
  pagePath: varchar("page_path", { length: 240 }).notNull(),
  selector: text("selector").notNull(),
  label: text("label").notNull(),
  elementType: varchar("element_type", { length: 30 }).notNull(),
  draftData: jsonb("draft_data").$type<{
    text?: string;
    href?: string;
    src?: string;
    alt?: string;
    hidden?: boolean;
    textMode?: "direct" | "full";
  }>().notNull(),
  publishedData: jsonb("published_data").$type<{
    text?: string;
    href?: string;
    src?: string;
    alt?: string;
    hidden?: boolean;
    textMode?: "direct" | "full";
  }>().notNull(),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export const visualPatchRevisions = pgTable("visual_patch_revisions", {
  id: serial("id").primaryKey(),
  pagePath: varchar("page_path", { length: 240 }).notNull(),
  snapshot: jsonb("snapshot").$type<unknown>().notNull(),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Media storage — Phase 2 local/MinIO foundation
// ─────────────────────────────────────────────────────────────────────────────

/** One logical image/document, independent of its storage provider. */
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  altText: text("alt_text").notNull().default(""),
  caption: text("caption"),
  folder: varchar("folder", { length: 120 }).notNull().default("site-assets"),
  category: varchar("category", { length: 80 }).notNull().default("Uncategorised"),
  provider: varchar("provider", { length: 20 }).notNull().default("local"),
  objectKey: text("object_key").notNull().unique(),
  originalFilename: text("original_filename").notNull(),
  mimeType: varchar("mime_type", { length: 80 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  originalSize: integer("original_size").notNull().default(0),
  dominantColor: varchar("dominant_color", { length: 20 }),
  blurDataUrl: text("blur_data_url"),
  contentHash: varchar("content_hash", { length: 64 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("processing"),
  uploadedBy: integer("uploaded_by"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: false }),
});

/** Responsive WebP (and future AVIF) files produced for an asset. */
export const mediaVariants = pgTable("media_variants", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  variantName: varchar("variant_name", { length: 30 }).notNull(),
  format: varchar("format", { length: 20 }).notNull().default("webp"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  objectKey: text("object_key").notNull().unique(),
  fileSize: integer("file_size").notNull(),
  publicUrl: text("public_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

/** Tracks where media is used so deletion can be made safe later. */
export const mediaUsage = pgTable("media_usage", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: text("entity_id"),
  fieldName: varchar("field_name", { length: 80 }),
  pagePath: text("page_path"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type AdmissionApplication = typeof admissionApplications.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type CmsPage = typeof cmsPages.$inferSelect;
export type CmsSection = typeof cmsSections.$inferSelect;
export type ContentCollection = typeof contentCollections.$inferSelect;
export type VisualPatch = typeof visualPatches.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type MediaVariant = typeof mediaVariants.$inferSelect;
export type MediaUsage = typeof mediaUsage.$inferSelect;
export type StaffMember = typeof staff.$inferSelect;
