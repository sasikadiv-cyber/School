# St. Thomas' College, Matale — Website & Admin Platform

A production-focused school website and mobile-first visual content management platform built with Next.js App Router, React, Drizzle ORM and PostgreSQL.

> **Current implementation status:** Phase 1 is complete. Phase 2 content managers and universal visual editing are functional. Phase 2.1 backup/environment foundations and the provider-neutral local/MinIO/R2 media foundation are now implemented.
>
> **Important:** Cloudflare R2 is **not required for development**. The default driver is local filesystem storage. MinIO can be enabled without a credit card; R2 is an environment-only production switch when billing access becomes available.
>
> Do not begin a later migration phase without reading the migration sequence, rollback plan and Definition of Done in this document.

---

## Implementation Progress — Current Build

### Completed

- [x] Phase 1 visual CMS, drafts, publishing and revisions.
- [x] Universal full-site element editor.
- [x] Structured News, Events, Gallery and Staff managers.
- [x] Persistent custom content collections/categories.
- [x] Phase 2.1 environment template and secret-safe `.gitignore`.
- [x] Database backup, restore and schema/row-count report scripts.
- [x] Provider-neutral media storage contract.
- [x] Local filesystem media adapter (default development mode).
- [x] S3-compatible MinIO adapter.
- [x] S3-compatible Cloudflare R2 adapter (configuration-ready; credentials not required during development).
- [x] Direct signed PUT upload support for MinIO/R2.
- [x] Local multipart development upload fallback.
- [x] Authoritative Sharp image validation and WebP processing.
- [x] EXIF/GPS removal, auto-orientation and safe pixel/file limits.
- [x] Thumbnail, small, medium, large and master variants.
- [x] Duplicate detection using SHA-256 content hashes.
- [x] Media asset, variant and usage metadata tables.
- [x] Categorized, mobile-first Media Library with upload progress, details, variants, filters, trash and restore.
- [x] Phase 2.8 reusable Media Picker (browse, search, folder-first context, inline upload).
- [x] News cover and Gallery frame fields integrated with the Media Picker; manual URLs kept for migration compatibility.
- [x] Universal visual editor image inspector integrated with the Media Picker.
- [x] `media_usage` synchronisation for posts, gallery frames and visual page patches (draft + published).
- [x] Usage locations shown in the asset detail drawer; used assets are blocked from trashing (server 409 + disabled UI).

### Editor & CMS Hardening Package — v2.8.14 (14-item admin request)

- [x] Visual editor → persistent **Home button** back to Admin Dashboard (`/admin`).
- [x] Hidden elements stay visible inside the editor (28% opacity, dashed amber outline, grayscale) with an explicit **Restore** action; the public site uses `display:none` so the next element reflows into place.
- [x] **Page Images & Banners navigator** — lists every image/video/iframe/background (incl. hero images hidden behind overlays); one click selects exactly that element for editing. Structured News/Gallery/Staff cards are excluded by design.
- [x] **Premade Component Library (Framer-style)** — Hero Banner, CTA, Stats Row, Image+Text, Heading, Text, Full Image and Quote blocks insertable on any page from the toolbar `+` drawer; draft/publish, hide, reorder, delete; all 16 public pages render blocks above the footer.
- [x] Vision & Mission — colour panels and YouTube embed are now selectable (panels support background colour + image replacement; iframes support `src` editing).
- [x] Staff portraits moved into the database (`staff.image`) with picker in the Staff Manager — principal/deputies/faculty avatars render from the DB with safe fallbacks; `media_usage` synced.
- [x] Exam-results five-year trend — editing a percentage automatically resizes its progress bar (`data-trend-row`/`data-trend-bar`, works in editor preview, bootstrap and public patch application).
- [x] **School logo** setting (Admin → Settings) renders in navbar, footer and mobile menu; circular Crest elements (clubs/societies/cadeting) support background-image replacement through the visual editor.
- [x] A/L course cards — cut-off Z-score chips are now selectable text spans.
- [x] Clubs & Cadeting crests editable via the universal editor (Crest components marked `data-visual-bg`).
- [x] **Unit Galleries** — new `unit_gallery_items` table, admin manager (`/admin/unit-gallery`), per-unit picker + upload, public cadeting page prefers managed photos over built-in frames; usage tracked.
- [x] Cadeting preloader removed from visual-editor scope (`data-visual-ui` shield) and moved to **Admin → Settings → Cadeting preloader** (enable/disable + direct-visit hold ms).
- [x] Structured content protection — DB-driven components (news/events/gallery/staff/posts) are marked `data-structured-content` and ignored by the visual editor; they can only be edited in their own managers.
- [x] Dark theme is now the site default; the toggle stores an explicit light preference.
- [x] **App versioning** — `src/lib/app-version.ts` holds `APP_VERSION` (`major.phase.feature.patch`), displayed in the Admin Studio sidebar.

### Phase 2.8 verification (performed 2026)

Automated end-to-end checks against a running production build:

1. Multipart local upload produced WebP variants and a `ready` asset.
2. Creating a gallery frame with a library URL inserted a `media_usage` row.
3. Trashing that asset returned HTTP 409 while the usage row existed.
4. Changing the frame image cleared the usage row; trash then succeeded.
5. Saving a visual page patch with a library `src` inserted a page-level usage row; publishing retained it and trash was again blocked.
6. Re-uploading the same file was detected by SHA-256 hash and safely reused (`duplicate: true`).
7. `/api/media/file` delivered processed WebP with immutable caching.
8. `npx next typegen`, `tsc --noEmit` and `next build` all pass.

### v2.8.14 verification (performed 2026)

1. All 16 public routes + cadeting unit pages return 200 with the new schema (`staff.image`, `unit_gallery_items`, `visual_blocks` pushed via Drizzle).
2. New endpoints `/api/admin/visual-blocks` and `/api/admin/unit-gallery` return 401 unauthenticated and are wrapped in the admin layout guard.
3. `data-trend-row`, `data-visual-bg` and `data-structured-content` markers verified in served HTML.
4. Draft/publish lifecycle for blocks shares the same publish endpoint as element patches (single "Publish now" action publishes both).

### Current development mode

```text
MEDIA_STORAGE_DRIVER=local
# Local development assets use the fixed, Git-ignored .data/media directory.
```

Uploaded development images are written under `.data/media`, which is ignored by Git. This storage is suitable for local/sandbox development only; it is not persistent production storage.

### Optional card-free MinIO mode

```text
MEDIA_STORAGE_DRIVER=minio
MINIO_ENDPOINT=http://127.0.0.1:9000
MINIO_BUCKET=school-media
MINIO_ACCESS_KEY_ID=<local access key>
MINIO_SECRET_ACCESS_KEY=<local secret>
MINIO_PUBLIC_BASE_URL=http://127.0.0.1:9000/school-media
```

The same admin uploader and processing pipeline work in local, MinIO and R2 modes. No UI rewrite is required during the eventual production switch.

Optional MinIO startup (requires Docker on the developer machine):

```bash
docker compose -f docker-compose.media.yml up -d
```

Then open `http://127.0.0.1:9001`, sign in with the local MinIO development credentials, create a `school-media` bucket, configure browser CORS for the development origin, and allow public reads for that **development bucket only**. Do not copy development credentials or public-write policies to production.

If Docker/MinIO is not available, keep `MEDIA_STORAGE_DRIVER=local`; no external account or card is required.

### Utility commands

```bash
# Create a custom-format PostgreSQL backup
node scripts/backup-database.mjs

# Generate a redacted schema and row-count report
node scripts/database-report.mjs

# Restore only after checking the target database carefully
ALLOW_RESTORE=YES BACKUP_FILE=.data/backups/<file>.dump node scripts/restore-database.mjs
```

### Next approved implementation section

1. ~~Test the local upload and WebP pipeline from mobile and desktop admin.~~ ✅ Verified (see Phase 2.8 verification above; retest from a physical phone before production).
2. Test a real local MinIO instance and browser CORS/direct signed uploads (requires Docker on the developer machine).
3. ~~Add media picker integration to News, Gallery, Staff and the universal visual editor.~~ ✅ Done — News, Gallery and the universal visual editor (Staff portraits use presets; no URL field exists there yet).
4. ~~Add `media_usage` synchronization so used assets cannot be trashed.~~ ✅ Done — posts, gallery frames and visual page patches are synced on every mutation.
5. Only then proceed to Supabase PostgreSQL migration.

---

## 1. Product Vision

The platform should remain:

- Premium and cinematic on the public website.
- Safe and simple enough for school staff to manage from a phone.
- Low-cost at school-scale traffic.
- Secure enough for admission applications and administrative records.
- Independent of local server storage.
- Easy to migrate, back up and restore.
- Extendable without repeatedly rewriting the same pages.

The administration experience follows a hybrid model:

- **Visual editor:** marketing pages and normal page content.
- **Structured managers:** news, events, gallery, staff, admissions, appointments and inquiries.
- **Media library:** categorized R2 assets with upload, processing, usage tracking and safe deletion.

---

## 2. Current Project State

### Public website

Implemented public areas include:

- Home
- History
- Vision & Mission
- Principal's Message
- Staff
- Ordinary Level and online resources
- Advanced Level and four stream detail pages
- Exam Results
- Achievements
- Clubs & Societies
- Sports
- Cadeting and five cinematic unit pages
- News & Events
- Gallery
- Admissions
- Contact and appointment booking

### Admin system

Implemented functionality includes:

- Secure first-admin setup and custom session authentication.
- Mobile-first dark admin dashboard.
- Full-width visual editor over the original website.
- Draft, publish, discard and revision workflows.
- Universal element-level visual editing.
- News/blog manager.
- Events manager.
- Gallery manager.
- Staff manager.
- Media asset browser for preloaded images.
- Custom content collections/categories.
- Admission applications and department appointments.
- Audit records.

### Current infrastructure

- Next.js App Router
- React
- PostgreSQL
- Drizzle ORM
- Local/public image assets and external image URLs
- Custom password/session authentication

### Target infrastructure

- **Application:** Next.js remains unchanged.
- **Database:** Supabase PostgreSQL accessed through Drizzle.
- **Authentication:** Supabase Auth using `@supabase/ssr`.
- **Roles:** application profiles/roles plus server-side permission checks.
- **Media:** Cloudflare R2 with a custom media domain.
- **Image delivery:** optimized WebP masters and responsive variants, optionally assisted by Cloudflare Image Transformations.

---

## 3. Final Architecture Recommendation

```text
Browser / Mobile Admin
        |
        |-- Public Website
        |-- Visual Editor
        |-- Structured Managers
        |
Next.js App Router
        |
        |-- Supabase Auth verification
        |-- Server-side permission layer
        |-- Drizzle ORM
        |-- R2 signed-upload API
        |
        |---- Supabase PostgreSQL
        |       |-- content
        |       |-- operational records
        |       |-- profiles and roles
        |       |-- media metadata
        |       |-- audit logs
        |
        |---- Cloudflare R2
                |-- WebP masters
                |-- thumbnails
                |-- optional originals
                |-- documents
                |-- temporary uploads
```

### Why this architecture

- Drizzle can continue to power all existing database code.
- Supabase Auth replaces only authentication/session logic; content APIs do not need a full rewrite.
- Direct signed uploads prevent large images from travelling through the Next.js hosting provider.
- R2 provides inexpensive object storage with no direct R2 egress fees.
- The database stores metadata and references, not binary files.
- Roles are checked on every server mutation instead of trusting the browser UI.

---

# 4. Phase 2 Implementation Roadmap

The migration must be completed in small, independently testable sections. Do not combine database, authentication and media cutovers in one release.

---

## Phase 2.1 — Preparation, Backups & Environment Abstraction

### Goal

Make the current project safe to migrate without changing production behavior.

### Work

1. Create a staging environment separate from production.
2. Export the current PostgreSQL schema and all data.
3. Save an off-site SQL backup.
4. Record current row counts for every table.
5. Record existing admin users, media URLs and page revisions.
6. Add an infrastructure health page visible only to super admins.
7. Document all current environment variables without storing secret values in Git.
8. Add database migration scripts instead of relying only on schema push.
9. Add a migration/cutover maintenance mode.
10. Add a rollback switch so the application can temporarily return to the previous database URL.

### Deliverables

- Verified SQL backup.
- Table-by-table row count report.
- Staging deployment.
- Environment variable template.
- Rollback checklist.

### Definition of Done

- The current application can be rebuilt from a fresh database backup.
- The backup restore has been tested, not merely created.
- No production data changes are required yet.

---

## Phase 2.2 — Supabase PostgreSQL Migration

### Recommendation

Migrate the database **before** migrating authentication. Keep the current custom authentication running temporarily while verifying the new Supabase database.

### Connection strategy

Use:

- `DATABASE_URL`: Supabase Shared Pooler / transaction mode for the running Next.js application.
- `DIRECT_DATABASE_URL`: direct connection for migrations and administrative operations.

Continue using Drizzle ORM.

### Work

1. Create a Supabase project in the closest suitable region.
2. Configure database passwords and network settings.
3. Create all existing tables in Supabase using migrations.
4. Import current content and operational data.
5. Reset database sequences after import.
6. Verify timestamps, JSON columns, unique constraints and indexes.
7. Point staging to Supabase's pooler URL.
8. Test all public reads.
9. Test all admin writes.
10. Test admissions, appointments and contact submissions.
11. Compare source and destination row counts.
12. Run a second delta import immediately before production cutover.

### Drizzle notes

- Keep Drizzle as the application's single content/database ORM.
- Supabase documentation recommends using the Connection Pooler for Drizzle.
- Transaction-pooling drivers may require prepared statements to be disabled, depending on the selected PostgreSQL driver.
- Do not expose direct database credentials to the browser.

### RLS decision

The recommended initial model is **server-owned writes**:

- The browser does not write content tables directly.
- Next.js APIs verify Supabase Auth and permissions.
- Drizzle performs the mutation server-side.
- Sensitive tables are not publicly readable through Supabase Data APIs.

RLS should still be enabled where Data API access exists, but application authorization must not depend only on hiding admin buttons.

### Backup warning

Supabase Free projects do not include the same automatic backup access as paid plans. Until a paid plan is used:

- Schedule regular `supabase db dump` or `pg_dump` exports.
- Store backups outside the Supabase project.
- Run restore tests.
- Retain at least seven recent daily copies and four weekly copies.

### Definition of Done

- Every existing table and row is present in Supabase.
- Public pages and all admin managers pass regression testing.
- New submissions write only to Supabase.
- No local database dependency remains in production.
- A tested rollback procedure exists.

---

## Phase 2.3 — Supabase Auth & Role Management

### Recommendation

Use `@supabase/ssr` with cookie-based sessions for Next.js App Router.

Do not use deprecated Auth Helpers.

For authorization decisions:

- Verify the authenticated identity server-side using trusted claims or a fresh user lookup.
- Never trust an unverified client session object.
- Never use user-editable metadata as the sole permission source.

### Authentication policy

- Public self-signup disabled.
- Accounts are invite-only.
- Email confirmation required.
- MFA required for super admins.
- Password recovery enabled.
- Disabled users lose access immediately.
- Shorter sessions for high-risk roles are preferred.

### Recommended roles

```text
super_admin
content_editor
news_editor
gallery_editor
staff_editor
admissions_officer
viewer
```

### Recommended permission matrix

| Module | Super Admin | Content | News | Gallery | Staff | Admissions | Viewer |
|---|---:|---:|---:|---:|---:|---:|---:|
| Visual pages | Full | Edit | Read | Read | Read | Read | Read |
| News | Full | Read | Edit | Read | Read | Read | Read |
| Events | Full | Read | Edit | Read | Read | Read | Read |
| Gallery | Full | Read | Read | Edit | Read | Read | Read |
| Media | Full | Upload | Upload | Upload | Upload | Read | Read |
| Staff | Full | Read | Read | Read | Edit | Read | Read |
| Admissions | Full | None | None | None | None | Edit | Read-only |
| Appointments | Full | None | None | None | None | Edit | Read-only |
| Settings | Full | Limited | None | None | None | None | None |
| Roles/users | Full | None | None | None | None | None | None |

### Database model

```text
profiles
  user_id              uuid, references auth.users
  display_name
  role
  active
  avatar_asset_id
  last_seen_at
  created_at
  updated_at

role_permissions       optional future normalization
admin_audit_logs       already exists; migrate user IDs to UUID-compatible form
```

### Migration from current auth

Do not migrate password hashes directly.

Recommended process:

1. Invite the existing administrator through Supabase Auth.
2. Confirm the new login works.
3. Assign `super_admin` in `profiles`.
4. Run both auth systems briefly only in staging.
5. Switch server guards to Supabase.
6. Revoke and delete old custom sessions.
7. Archive or remove obsolete custom auth tables after a safety period.

### Definition of Done

- Each role sees only its permitted admin modules.
- Every API mutation enforces permissions server-side.
- Unauthorized API calls return 401 or 403.
- Super admin MFA works.
- Account deactivation immediately blocks access.
- Audit logs identify Supabase user IDs.
- Current custom auth can be safely removed.

---

## Phase 2.4 — Cloudflare R2 Foundation

### Recommendation

Use a dedicated R2 bucket and custom media domain, for example:

```text
media.stcmatale.lk
```

Use the **Standard** storage class initially. School website assets are frequently accessed and should not incur retrieval fees.

### Current official R2 cost envelope

At the time this roadmap was written, Cloudflare documents:

- 10 GB-month Standard storage included per month.
- 1 million Class A operations included per month.
- 10 million Class B operations included per month.
- Direct R2 egress to the Internet is free.
- Standard storage beyond the allowance is listed at a low per-GB monthly price.

Pricing can change; verify the official pricing page before implementation.

### Bucket design

Use one production bucket initially, with clear prefixes:

```text
temporary/
originals/
images/site/
images/news/YYYY/
images/gallery/campus/
images/gallery/academics/
images/gallery/sports/
images/gallery/arts-culture/
images/staff/
images/cadeting/army/
images/cadeting/eastern-band/
images/cadeting/western-band/
images/cadeting/police-cadet/
images/cadeting/scouts/
documents/admissions/
documents/academics/
trash/
```

### Direct upload flow

```text
Authenticated admin chooses file
        ↓
Browser validates size/type
        ↓
Next.js creates one short-lived signed PUT URL
        ↓
Browser uploads directly to R2
        ↓
Server verifies object metadata
        ↓
Image processing runs
        ↓
Metadata record becomes ready
```

### Signed URL security

- Generate an unpredictable server-controlled object key.
- Never accept a complete client-provided R2 key.
- Restrict `Content-Type` in the signed PUT operation.
- Use a short expiry, ideally 5–10 minutes.
- Allow only the exact R2 bucket and object.
- Configure R2 CORS for the real admin origin only.
- Keep R2 access key and secret server-side.
- Enforce per-file and per-user upload limits.
- Verify the resulting object after upload.

### Recommended upload limits

- Images: maximum 15–20 MB before browser compression.
- Processed master: maximum 3–4 MB.
- Documents: maximum based on business need, initially 20 MB.
- Video: do not upload through this system initially; use YouTube/Vimeo embeds.

### Delivery and caching

Use content-hashed object names:

```text
images/gallery/sports/big-match.ab12cd34.webp
```

Recommended cache header:

```text
Cache-Control: public, max-age=31536000, immutable
```

Replacing an image creates a new object key. Do not overwrite a cached object at the same URL.

### Definition of Done

- Signed direct upload succeeds without proxying bytes through Next.js.
- Upload URL cannot write another object key.
- R2 CORS works only for approved origins.
- Custom media domain serves files through Cloudflare cache.
- Secrets are never exposed to the browser or committed to Git.
- Failed temporary uploads are cleaned automatically.

---

## Phase 2.5 — Image Processing & WebP Pipeline

### Main recommendation for low cost

Use a two-layer strategy:

1. **Browser pre-processing** for speed and reduced upload size.
2. **Server/Worker authoritative validation and transformation** for consistency and safety.

Do not rely only on browser conversion.

### Low-cost rollout

#### Initial release

- Browser resizes large phone photos to a maximum long edge of 2560 px.
- Browser converts to WebP around quality 80–84.
- A small blurred/thumbnail WebP is generated.
- Processed assets upload directly to R2 through signed URLs.
- Server verifies extension, content type, dimensions, size and ownership.

#### Later optimization

Use Cloudflare Image Transformations for automatic width/format negotiation if usage and budget justify it. Cloudflare documentation indicates that image transformations can operate on assets stored outside Cloudflare Images, including R2; pricing and included transformations must be verified before enabling production usage.

A Worker with an Images binding can also transform bytes from R2 before writing variants, but some workflows require Cloudflare Images paid capabilities. Do not assume all upload-time transformations are free.

### Recommended outputs

For a typical photograph:

```text
master.webp         max 2560 px, quality ~82
large.webp          1920 px, quality ~80
medium.webp         1280 px, quality ~79
small.webp           640 px, quality ~76
thumbnail.webp       320 px, quality ~72
```

AVIF is optional. Start with WebP for predictable compatibility and processing cost.

### Asset-type presets

| Asset | Master max | Crop | Notes |
|---|---:|---|---|
| Hero | 2560 px | landscape | protect focal point |
| Gallery landscape | 1920 px | none | preserve composition |
| Gallery portrait | 1600 px | none | portrait metadata |
| Staff portrait | 1200 px | 4:5 optional | face focal point |
| News cover | 1920 px | 16:10 preview | original crop preserved |
| Logo/crest | original | none | preserve SVG/PNG where appropriate |

### Privacy and safety

Processing must:

- Auto-rotate based on orientation metadata.
- Strip EXIF data.
- Strip GPS coordinates.
- Reject unsupported/corrupt files.
- Confirm real file signatures instead of trusting extensions.
- Limit pixel dimensions to prevent decompression bombs.
- Prevent SVG script injection; sanitize or disallow arbitrary SVG uploads.

### Originals policy

Recommended low-budget approach:

- Retain originals only for hero, archival and historically significant photos.
- Mark temporary originals for deletion after 7–30 days.
- Keep processed WebP masters permanently.
- Use lifecycle cleanup for abandoned uploads.

### Definition of Done

- A large phone JPEG becomes consistent WebP variants.
- Orientation is correct.
- GPS and EXIF data are removed.
- Variants are recorded in the database.
- Processing failure is visible in admin UI and retryable.
- Failed jobs leave no public broken assets.

---

## Phase 2.6 — Media Metadata Model

### Tables

```text
media_assets
  id                    uuid
  title
  alt_text
  caption
  folder
  category
  status                uploading | processing | ready | failed | trashed
  original_key
  original_filename
  mime_type
  width
  height
  original_size
  dominant_color
  blur_data_url
  content_hash
  focal_x
  focal_y
  uploaded_by
  created_at
  updated_at
  deleted_at

media_variants
  id
  asset_id
  variant_name          thumbnail | small | medium | large | master
  format
  width
  height
  r2_key
  file_size
  public_url
  created_at

media_usage
  id
  asset_id
  entity_type           page | post | gallery | staff | event
  entity_id
  field_name
  page_path
  created_at
```

### Important constraints

- `content_hash` should prevent duplicate uploads.
- An asset cannot be permanently deleted while active usage rows exist.
- Replacing an image creates new variant keys.
- Trashing an asset does not immediately delete R2 objects.
- Permanent deletion should require super-admin permission.

---

## Phase 2.7 — Categorized Media Library Redesign

### Reason for delaying until after R2

The current browser only displays existing URLs. Building the final library before the R2 object model and metadata tables exist would require rewriting it twice.

### Desktop layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Search | Type | Orientation | Year | Sort | Upload           │
├───────────────┬─────────────────────────────────────────────┤
│ All Media     │ Thumbnail grid                              │
│ Recent        │                                             │
│ Site Assets   │                                             │
│ News          │                                             │
│ Gallery       │                                             │
│  ├ Campus     │                                             │
│  ├ Academics  │                                             │
│  ├ Sports     │                                             │
│  └ Arts       │                                             │
│ Staff         │                                             │
│ Cadeting      │                                             │
│ Documents     │                                             │
│ Unused        │                                             │
│ Trash         │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

### Mobile layout

- Two-column thumbnail grid.
- Folder/category switcher in a bottom sheet.
- Floating Upload button.
- Full-screen asset detail panel.
- Sticky search bar.
- Filter and sort sheets.
- Large touch targets.

### Asset card

Each card displays:

- Thumbnail
- Title
- Dimensions
- File size
- Format
- Folder/category
- Usage count
- Processing status

### Asset detail drawer

- Large preview
- Title
- Alt text
- Caption
- Folder
- Category
- Focal point control
- Dimensions and file sizes
- Available variants
- R2 object key
- Public URL
- Usage locations
- Replace
- Copy URL
- Download original, where permitted
- Move to trash

### Filters

- Images / Documents / Video embeds
- Folder
- Category
- Year
- Landscape / Portrait / Square
- Uploaded by
- Used / Unused
- Ready / Processing / Failed
- Newest / Oldest / Largest / Smallest

### Definition of Done

- Admins can understand the library without seeing one stressful infinite grid.
- Uploading from a phone works reliably.
- Search and filters remain usable with thousands of assets.
- Clicking an image opens details instead of immediately copying a URL.
- Unused assets can be identified.
- Used assets cannot be accidentally deleted.

---

## Phase 2.8 — CMS and Content Manager Integration

### Goal

Replace manual image URL fields with an asset picker.

### Integration points

- Universal visual editor image inspector
- Home/History section editor
- News cover images
- Gallery frame images
- Staff portraits
- A/L building images
- Sports/cadeting images
- Settings logo/brand assets

### Picker behavior

1. Open Media Picker.
2. Show context-relevant folder/category first.
3. Select asset.
4. Pick focal point/crop where applicable.
5. Store `asset_id` plus resolved public URL.
6. Create a `media_usage` record.
7. Remove previous usage reference safely.

### Migration compatibility

During transition, fields should support:

- Existing `/images/...` URLs.
- Existing external Pexels URLs.
- New R2 asset URLs.
- New `media_asset_id` references.

Do not break existing pages while migration is incomplete.

---

## Phase 2.9 — Existing Media Migration

### Steps

1. Inventory every image URL used by the website and database.
2. Download or locate source files where legally permitted.
3. Compute content hashes and remove duplicates.
4. Process variants.
5. Upload to R2.
6. Insert media metadata and variants.
7. Update content references in batches.
8. Verify every page visually.
9. Run a broken-image crawler.
10. Keep old paths operational during a safety window.
11. Remove old public assets only after final approval.

### Externally sourced images

Before copying external stock images into R2, confirm that the license allows storage and redistribution. Keep source/attribution metadata where required.

---

## Phase 2.10 — Hardening, Backups & Launch

### Required checks

- Auth role test matrix.
- RLS policy tests where applicable.
- API permission tests.
- Signed upload abuse tests.
- Upload size/type tests.
- Duplicate image test.
- Broken image test.
- Mobile upload test on weak connectivity.
- Database restore test.
- R2 object restoration/versioning plan.
- Content publish/revision restore tests.
- Admin account disable test.
- Audit log completeness.

### Operational jobs

- Nightly database dump on Free plan.
- Temporary R2 object cleanup.
- Failed processing cleanup.
- Orphan media usage scan.
- Revision retention cleanup.
- Audit retention cleanup.
- Broken link/image monitoring.

---

# 5. Environment Variables — Future Target

Do not place secret values in this README or Git.

```text
# Supabase public
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Supabase server
SUPABASE_SECRET_KEY=
DATABASE_URL=                  # Pooler connection
DIRECT_DATABASE_URL=           # Migration/direct connection

# Cloudflare R2 server-only
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE_URL=https://media.example.com

# Optional Cloudflare image processing
CLOUDFLARE_IMAGES_ACCOUNT_HASH=
CLOUDFLARE_IMAGES_TOKEN=

# Application
NEXT_PUBLIC_APP_URL=
```

### Secret rules

- Never prefix R2 or Supabase secret keys with `NEXT_PUBLIC_`.
- Never send service-role/secret credentials to the browser.
- Rotate secrets after accidental exposure.
- Separate staging and production credentials.

---

# 6. Cost-Control Recommendation

For the intended school-scale workload, the recommended starting point is:

- Supabase Free during development/staging if limits are acceptable.
- Supabase Pro for production when uptime and automatic daily backups are required.
- R2 Standard with the free monthly allowance initially.
- WebP-first media pipeline.
- No self-hosted video.
- No large binary files in PostgreSQL.
- No unnecessary realtime subscriptions.
- No automatic generation of dozens of unused image variants.

### Current Supabase free-plan considerations

The official pricing page currently describes, among other limits:

- 500 MB database size.
- 50,000 monthly active users.
- 5 GB egress plus cached egress allowance.
- Free projects can pause after inactivity.
- Automatic backups are not included at the same level as Pro.

Verify limits before production launch.

### Expected media behavior

A school site with several thousand optimized images can often remain inexpensive on R2, especially when:

- Images are WebP.
- Duplicates are detected.
- Originals are cleaned according to policy.
- Public delivery uses Cloudflare cache.
- Video remains external.

---

# 7. Rollback Strategy

Every infrastructure change must be reversible.

## Database rollback

- Keep the pre-migration PostgreSQL backup.
- Keep old database credentials available but disabled.
- Maintain a deployment version that supports the old schema until acceptance.
- If Supabase cutover fails, restore the previous deployment and database URL.

## Authentication rollback

- Do not delete custom auth tables during the first Supabase Auth release.
- Keep the old auth code in a rollback branch.
- Remove old auth only after stable production use and account recovery testing.

## R2 rollback

- Keep old public image paths working during migration.
- Update image references gradually.
- Do not delete old assets until all pages pass visual and broken-link checks.
- Store an export of media metadata and R2 object keys.

---

# 8. Future Phase 3

After infrastructure and media are stable, Phase 3 should focus on operations:

- Admissions workflow dashboard.
- Appointment calendar and confirmation.
- Contact inbox.
- Status changes and internal notes.
- CSV export.
- Email notifications.
- Role administration.
- Full audit viewer.
- Analytics and content health.
- Scheduled publishing.
- Expired announcement handling.

Do not start Phase 3 before Supabase Auth, roles, R2 and media usage tracking are production-stable.

---

# 9. Recommended Next Implementation Session

Start with **Phase 2.1 only**.

### Exact first-session scope

1. Create migration/backup documentation.
2. Add `.env.example` with placeholders only.
3. Add database migration tooling/configuration.
4. Produce table row-count and schema reports.
5. Add staging readiness checks.
6. Do not change authentication.
7. Do not change media storage.
8. Do not change production database yet.

Once Phase 2.1 is tested and accepted, proceed to Phase 2.2 Supabase PostgreSQL migration.

---

# 10. Continuation Checklist for Future AI/Developer Sessions

Before changing code:

- Read this README completely.
- Inspect the current schema and migration history.
- Confirm which Phase 2 sub-phase is approved.
- Do not combine unapproved phases.
- Back up before database changes.
- Preserve mobile-first admin usability.
- Preserve existing URLs and published content.
- Test draft/publish behavior after every change.
- Run Next route type generation, TypeScript and production build.
- End with a production server/healthcheck validation.

After changing code:

- Record completed work in this README.
- Record new environment variables.
- Record schema migrations.
- Record rollback instructions.
- Record tests performed.
- Do not mark a sub-phase complete until its Definition of Done passes.

---

# 11. Decision Log

## Accepted decisions

- Next.js remains the application framework.
- Drizzle remains the ORM.
- Supabase is the target PostgreSQL and authentication provider.
- Cloudflare R2 is the target media/document object storage provider.
- R2 uploads should be direct from the browser through signed URLs.
- Image processing is WebP-first.
- Media metadata is stored in PostgreSQL.
- Visual page editing and structured content managers remain separate.
- Media Library is rebuilt only after the R2/media metadata model is ready.
- Public signup is disabled; admin access is invite-only.

## Decisions still required before implementation

- Production Supabase plan: Free or Pro.
- Final Supabase region.
- Production media domain.
- Keep or delete original images after processing.
- Use browser + Sharp, browser + Worker, or Cloudflare Image Transformations for authoritative variants.
- Exact backup destination and schedule.
- MFA enforcement policy for non-super-admin roles.
- Revision and audit-log retention duration.

---

# 12. Official References

Review current official documentation immediately before implementation because pricing and platform behavior can change.

- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare R2 presigned URLs: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- Cloudflare R2 uploads: https://developers.cloudflare.com/r2/objects/upload-objects/
- Cloudflare Image Transformations: https://developers.cloudflare.com/images/optimization/transformations/
- Cloudflare Images pricing: https://developers.cloudflare.com/images/pricing/
- Supabase pricing: https://supabase.com/pricing
- Supabase Next.js guide: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Drizzle guide: https://supabase.com/docs/guides/database/drizzle
- Supabase database connections: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase database backups: https://supabase.com/docs/guides/platform/backups

---

_Last updated: 2026. Update this roadmap as each sub-phase is approved and completed._
