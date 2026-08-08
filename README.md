# Rudra Guruji Naga Sadhu Charitable Trust

Website for the Rudra Guruji Naga Sadhu Charitable Trust — daily Nithya Annadhanam, farmer
support, medical and hospitalisation aid, financial help and Vidya Daanam.

Built with **Next.js 16** (App Router) · **TypeScript** · **Tailwind CSS v4** ·
**Shadcn UI** · **Supabase**.

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase keys
npm run dev
```

Open <http://localhost:3000>.

The public pages run entirely on placeholder data, so the site works before
Supabase is connected.

## Scripts

| Command         | What it does              |
| --------------- | ------------------------- |
| `npm run dev`   | Dev server with Turbopack |
| `npm run build` | Production build          |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                    |

---

## Project layout

```
src/
  proxy.ts                Redirects un-prefixed URLs to the best-matching locale
  app/
    globals.css           Devotional theme tokens, textures, per-script fonts
    [lang]/
      layout.tsx          Root layout — fonts, sidebar, header, audio, footer
      page.tsx            Home: hero, mission, donate QR, recent events
      events/page.tsx     Daily events feed with category filtering
      gallery/page.tsx    Masonry photo gallery with filter and lightbox
      seva/page.tsx       The five standing karyakramas
      donate/page.tsx     Full donation page
      volunteer/page.tsx  Volunteer roles and contact
      about/page.tsx      Trust story and principles
      admin/page.tsx      Placeholder — the secure portal lands in phase 2
  components/
    audio/                Background chant provider + toggle buttons
    layout/               Desktop rail, header, language switcher, footer
    events/               Event card, image gallery/lightbox, filter feed
    gallery/              Masonry grid + lightbox, home preview strip
    donate/               UPI QR code block
    home/                 Hero, section headings
    ui/                   Shadcn components
  lib/
    i18n/
      config.ts           Locale list, native names, path helpers
      dictionaries.ts     Dictionary loader + locale resolution
      chrome.ts           The dictionary slice the shell needs
      dictionaries/       en.ts (source of truth), hi.ts, te.ts, kn.ts
    site.ts               Contact details, UPI, nav items, audio path
    gallery.ts            Photo manifest — sizes, blur previews, categories
    seva.ts               Karyakrama icons and ordering
    types.ts              Types mirroring the database schema
    placeholder-data.ts   Stand-in events and categories
    supabase/             Browser client, server client, env handling
supabase/
  schema.sql              Full database schema, RLS policies and seed data
```

---

## Before going live — replace these

| What                | Where                                        | Status |
| ------------------- | -------------------------------------------- | ------ |
| Trust name          | `brand` in all four dictionaries             | ✅ Rudra Guruji Naga Sadhu Charitable Trust |
| UPI ID              | `src/lib/site.ts` → `siteConfig.upi.vpa`     | ✅ `9581916714@ybl` |
| Phone               | `src/lib/site.ts` → `siteConfig.phone`       | ✅ +91 80087 21696 |
| Address             | `src/lib/site.ts` → `siteConfig.address`     | ⚠️ District only — add village/street |
| Email               | `src/lib/site.ts` → `siteConfig.email`       | ✅ `rudragurujisevatrust@gmail.com` |
| Impact statistics   | `src/lib/placeholder-data.ts` → `statValues` | ⚠️ Invented figures |
| Events-feed art     | `public/placeholders/`                       | ⚠️ The *gallery* uses real photos; the feed does not |
| Translated copy     | `src/lib/i18n/dictionaries/`                 | ⚠️ Have a native speaker review |

> **Email:** `rudragurujisevatrust@gmail.com`, supplied by the trust on
> 2026-08-08. It appears as a `mailto:` link in the footer, on the Donate page
> (twice — the page body and the QR card) and on the Volunteer page. All four
> read `siteConfig.email`, so changing it in one place changes it everywhere.

> **UPI note:** `9581916714@ybl` is a PhonePe handle tied to a phone number.
> UPI apps display the name registered against the VPA, not the `payeeName` in
> the deep link — so donors may see an individual's name rather than the trust's.
> If that matters, register a business VPA in the trust's name.

---

## Sharing, SEO and accessibility

**`NEXT_PUBLIC_SITE_URL` must be set at build time in production.** It is the
origin used for Open Graph image URLs and the sitemap; social apps reject
relative paths, so without it link previews break. It falls back to
`http://localhost:3001` for local work.

- **Share cards** — `public/og/{en,hi,te,kn}.jpg`, 1200×630, built from the
  Himalaya photograph with the trust's name in each script. This matters more
  than usual here: the site will mostly travel by WhatsApp, and a link with no
  preview image gets ignored. Regenerate them if the name or tagline changes.
- **`sitemap.xml`** — 28 URLs, each listing its four translations as
  `xhtml:link` alternates, which is what makes Google serve a Telugu speaker
  the Telugu page. `/admin` is excluded.
- **`robots.txt`** — allows everything except `/*/admin`, points at the sitemap.
- **Icons** — `favicon.ico`, `apple-icon.png` and the PWA icons are the ॐ mark
  on maroon, generated by the script kept with the design notes.
- **`manifest.webmanifest`** — lets devotees add the site to an Android home
  screen.
- **One `h1` per page.** `SectionHeading` takes `as="h1"` for a page's leading
  heading and defaults to `h2` for later sections.
- **Skip link** to `#main`, so a keyboard user isn't forced through the whole
  sidebar on every page.
- **Lightbox focus** — `src/hooks/use-lightbox.ts` handles Escape, arrow keys,
  scroll lock, focus trapping, and returning focus to the thumbnail that opened
  the viewer. Shared by the gallery and the events feed.

---

## Gallery

Sixteen photographs and posters supplied by the trust live in `public/gallery/`,
described by `src/lib/gallery.ts`. They appear in two places: the full gallery
at `/[lang]/gallery`, and a six-photo preview strip on the home page.

- **Masonry layout** via CSS columns, so portrait and square images keep their
  own aspect ratio without cropping or leaving gaps.
- **Filter chips** — All / Seva / Guruji / The Trust.
- **Lightbox** with arrow-key and Escape support, and a caption per photo.
- **Blur-up loading**: each entry carries a ~20px inline JPEG in `blur`, so a
  preview shows instantly while the full image streams in, and the real
  intrinsic width/height are recorded so nothing reflows.

### Adding or replacing photographs

1. Drop the image into `public/gallery/`.
2. Add an entry to `galleryImages` in `src/lib/gallery.ts` — `slug`, `src`,
   the true `width`/`height`, a `category`, and a `blur` data URI.
3. Add the caption under `gallery.captions.<slug>` in **all four**
   dictionaries.

The slug type is `keyof Dictionary["gallery"]["captions"]`, so step 3 is not
optional — an image without captions in every language fails the build rather
than rendering a blank label.

Two of the supplied files were WhatsApp screenshots; the chat UI was cropped off
automatically by detecting the photo region, so only the photograph remains.

---

## Languages

The site ships in **English, हिन्दी (Hindi), తెలుగు (Telugu) and ಕನ್ನಡ
(Kannada)**. A globe-icon switcher sits in the top bar on every page, at every
screen width.

### How it works

- Every route lives under `app/[lang]/`, so each language has a real,
  bookmarkable URL: `/en/donate`, `/te/donate`, `/kn/donate`, `/hi/donate`.
- `src/proxy.ts` redirects un-prefixed URLs (`/`, `/donate`) to the visitor's
  best match, read from their `Accept-Language` header, falling back to English.
- The switcher options are ordinary `<Link>`s to the *same page* in another
  locale, so switching never loses the reader's place and works without JS.
- All four locales are prerendered at build time — 8 routes × 4 languages.
- `<html lang>` is set correctly per locale, and `hreflang` alternates are
  emitted so search engines treat the pages as translations of one another.

### Editing or adding a translation

`src/lib/i18n/dictionaries/en.ts` is the source of truth: the `Dictionary` type
is derived from it, so **a key missing from `hi.ts`, `te.ts` or `kn.ts` is a
build error**, not a blank space on the page.

To add a fifth language:

1. Copy `en.ts` to `<code>.ts` and translate the values.
2. Add the code to `locales` and `localeMeta` in `src/lib/i18n/config.ts`.
3. Register the import in `src/lib/i18n/dictionaries.ts`.
4. If it needs a different script, add the font and an `html[lang="…"]`
   override in `globals.css` (see the existing Telugu/Kannada blocks).

### Typography per script

Marcellus covers Latin only and Mukta covers Latin + Devanagari, so Telugu and
Kannada use Noto Sans in their script for both headings and body. `globals.css`
swaps `--font-display` / `--font-body` off the `html[lang]` attribute.

Indic scripts stack vowel signs above and below the baseline, so the tight
leading and negative letter-spacing that suit Latin clip them. A small unlayered
rule block raises the line-height floor for `hi`/`te`/`kn` only — unlayered CSS
beats Tailwind's layered utilities, so no `!important` is needed and the English
pages are untouched.

### What is *not* translated

Deliberately kept in one form everywhere:

- The **UPI payee name and note** in the QR deep link — these are matched
  against the registered UPI handle by the payment network.
- Email, phone and postal address.
- Numerals in the impact statistics (only their labels are translated).

> **Please have a native speaker review the Hindi, Telugu and Kannada copy
> before launch.** The translations are careful and idiomatic, but this is
> devotional and charitable language where tone matters, and no automated
> translation should go public unreviewed.

---

## Design system

The palette is defined once as CSS custom properties in `src/app/globals.css`
and exposed to Tailwind through `@theme inline`. Both light and dark themes are
defined.

Devotional colours are available as normal Tailwind utilities:

```
bg-saffron   bg-saffron-deep   text-kumkum   text-maroon
border-gold  bg-gold-soft      bg-sandal     text-turmeric
```

Three helper classes carry the traditional feel:

- `.texture-temple` — a woven diagonal weft with kumkum dots, painted purely
  with CSS gradients (no image requests), kept under 4% alpha so text contrast
  is untouched. Applied to `<main>`.
- `.glow-diya` — warm lamp glow behind hero and donate sections.
- `.border-toran` — repeating scallop, like a mango-leaf toran.

Fonts: **Marcellus** for headings (temple-inscription feel) and **Mukta** for
body text — Mukta carries Devanagari, so `ॐ नमः शिवाय` renders in the same
family as the English copy.

---

## Background audio

The looping **Om Namah Shivaya** chant is controlled by
`src/components/audio/audio-provider.tsx` and surfaced by two always-visible
controls: a floating round button (bottom-right, on every page) and an inline
row in the sidebar footer.

The track is installed at `public/audio/om-namah-shivaya.mp3` — 8.6 seconds,
128 kbps, ~136 KB, supplied by the trust and verified decoding in-browser. It is
short, so the loop seam repeats often; swapping in a longer recording of the
same chant needs no code change. See `public/audio/README.md`.

Browsers block sound that starts without user interaction, so the player:

1. remembers the visitor's choice in `localStorage` (defaults to on),
2. attempts playback on load, and
3. retries on the visitor's first click, tap or keypress if the browser refused
   — showing "Tap anywhere to begin the chant" in the meantime.

A single `<audio>` element is created imperatively so playback survives
client-side navigation between pages.

---

## Database

Run `supabase/schema.sql` in the Supabase dashboard: **SQL Editor → New query →
paste → Run**. It is idempotent and safe to re-run.

It creates:

- **`categories`** — `id`, `name`, `slug`, `color`, `translations`,
  `created_at`. Seeded with six starter categories, already translated into all
  four languages.
- **`events`** — `id`, `title`, `description`, `images` (ordered `text[]` of
  Storage URLs), `translations`, `event_date`, `published`, `created_at`,
  `updated_at`.

  `translations` is a `jsonb` column holding the non-English copy, keyed by
  locale — `{"te": {"title": "…", "description": "…"}, "kn": {…}}`. One JSON
  column rather than a column per language means adding a fifth locale needs no
  migration, and a missing key falls back to the English original instead of
  rendering blank.
- **`event_categories`** — the join table, composite PK, cascading deletes.
- **`admin_users`** — identifies the single master admin.
- A public **`event-images`** Storage bucket.
- Row Level Security on every table: the public reads published events and all
  categories; every write requires `public.is_admin()`.

### Seeding the master admin

1. **Authentication → Users → Add user** — create the one admin account,
   ticking *Auto Confirm User*.
2. **Authentication → Sign In / Providers → Email** — turn **off** "Allow new
   users to sign up", so no second account can ever be created.
3. Run, with the real address substituted:

   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'admin@example.com'
   on conflict (user_id) do nothing;
   ```

4. Verify — this must return exactly one row:

   ```sql
   select * from public.admin_users;
   ```

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in from
**Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (older projects call this the *anon*
  key; `NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted too)

`next.config.ts` derives the `next/image` remote pattern from
`NEXT_PUBLIC_SUPABASE_URL`, so Storage photos work without further config — but
**restart the dev server after editing `.env.local`**, since the hostname is
read at config load.

---

## Status

**Built and verified:**

- Root layout with the persistent sidebar (fixed rail ≥1024px, slide-out drawer
  below), always-visible top bar, and the background-audio toggle
- Four languages — English, Hindi, Telugu, Kannada — with a switcher on every
  page, locale-prefixed URLs, and `Accept-Language` negotiation
- All eight public routes in all four locales
- Photo gallery from the trust's own 16 images, with filtering, lightbox and
  blur-up loading, plus a preview strip on the home page
- The Om Namah Shivaya chant installed and verified playing
- Events feed with live category filtering and counts
- Single-image and multi-image galleries with a keyboard-navigable lightbox
- UPI QR donation block with amount presets, copy-to-clipboard, and a deep-link
  button on phones
- Supabase browser and server clients, plus the full SQL schema
- Clean production build; **all routes prerendered static across four locales**

**Not built yet — phase 2:**

- Admin authentication (login route, session refresh, route guard)
- Admin dashboard: event create/edit/delete, image upload to Storage, category
  management — including the per-locale title/description fields that fill the
  `translations` column
- Swapping the public pages from placeholder data to live Supabase queries

> Note: Next.js 16 renamed `middleware.ts` to **`proxy.ts`** (exporting a
> `proxy` function, Node.js runtime only). `src/proxy.ts` already exists for
> locale routing — the Supabase session refresh in phase 2 must be added to
> that same file rather than a new `middleware.ts`.

---

## Notes

`CLAUDE.md` and `AGENTS.md` are generated by `next dev` and point AI agents at
the version-specific docs bundled in `node_modules/next/dist/docs/`. Leave them
in place.
