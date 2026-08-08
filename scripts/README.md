# Asset generation scripts

One-off Python scripts that build static assets. They are not part of the
Next.js build — run them by hand when the inputs change, and commit the output.

Both need Pillow (`pip install Pillow`) and the Noto Indic fonts, which on
Debian/Ubuntu come from `fonts-noto-core`.

## `generate-og-images.py`

Builds `public/og/{en,hi,te,kn}.jpg` — the 1200×630 social share cards — from
`public/gallery/himalaya-tapas.jpg` plus the trust name and tagline in each
script.

Re-run it if the trust's name, the tagline, or the background photograph
changes. The strings are hard-coded at the top of the file; keep them in step
with `brand` in the dictionaries.

```bash
python3 scripts/generate-og-images.py
```

## `generate-icons.py`

Builds `src/app/favicon.ico`, `src/app/apple-icon.png`, and the PWA icons in
`public/` — the ॐ mark in gold on the sidebar's maroon.

```bash
python3 scripts/generate-icons.py
```
