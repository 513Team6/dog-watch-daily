# Dog Watch Daily — project context

A tiny Next.js (App Router) site deployed on Vercel. Eric watches neighbors'
dogs and posts a daily photo for each one. Each dog gets its own unguessable
URL (`/dog/[slug]`) with no login, sent to the owner at the start of the
week. Eric posts updates from a password-protected `/admin` page.

No database: all data (dog metadata, captions, and photos) lives in Vercel
Blob storage as JSON + image blobs under `dogs/{slug}/...`.

## Architecture

- `middleware.js` — gates everything under `/admin` behind a cookie set from
  `ADMIN_PASSWORD` (env var). `/admin/login` is the exception.
- `lib/blob.js` — all Blob storage reads/writes. Pathnames:
  - `dogs/{slug}/meta.json` — `{ name, owner, createdAt }`
  - `dogs/{slug}/entries.json` — array of `{ url, caption, date, uploadedAt }`, newest first
  - `dogs/{slug}/photos/{timestamp}.{ext}` — the actual images
- `app/admin/*` — password-gated pages/actions to create dogs and upload photos.
- `app/dog/[slug]/page.js` — the public page owners are sent.

## Known gotchas already solved (don't re-break these)

1. **`@vercel/blob` must be a current major version (`^2.3.3`+), not `^0.27.x`.**
   Vercel now authenticates Blob access via OIDC (`VERCEL_OIDC_TOKEN` +
   `BLOB_STORE_ID`) by default when a store is connected to a project, rather
   than the old static `BLOB_READ_WRITE_TOKEN`. Old SDK versions don't know
   how to use OIDC and throw at runtime with no useful error until you check
   Vercel's function logs.

2. **The Blob store's access mode (Private vs Public) is set permanently at
   creation and cannot be changed later.** This app needs a **Public** store,
   since dog photo pages are plain `<img src>` links with no auth. If you
   ever see `Cannot use public access on a private store`, the fix is to
   create a new Public store and connect it to the project (can't convert
   the existing one).

3. **HEIC/HEIF photos** (default format for iPhone camera uploads) don't
   render in most browsers. `lib/blob.js`'s `addPhotoEntry()` detects HEIC by
   filename/MIME type and converts to JPEG server-side via the
   `heic-convert` package before storing it.

4. **Server Actions handle the admin forms** (`app/admin/actions.js`,
   `app/admin/login/actions.js`) — no separate API routes. `next.config.js`
   raises the server action body size limit to 10mb for photo uploads.

## Deployment

- Hosted on Vercel, connected to a GitHub repo, auto-deploys on push to `main`.
- Env vars needed in Vercel: `ADMIN_PASSWORD`. Blob credentials are injected
  automatically once the (Public) Blob store is connected to the project.
- See `README.md` in the project for the full one-time setup walkthrough.

## Style/conventions

- Plain JavaScript (no TypeScript), App Router, minimal dependencies.
- No client-side framework beyond what Next.js/React provide out of the box.
- Keep it lightweight — this is a personal/neighborhood-scale project, not
  something that needs a database, real auth, or a design system.
