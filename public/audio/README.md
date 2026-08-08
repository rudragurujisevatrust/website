# Background chant audio

`om-namah-shivaya.mp3` — the looping chant, supplied by the trust.

- 8.6 seconds, MP3, 128 kbps, 48 kHz stereo, ~136 KB.
- Loops continuously; at that length the seam repeats often, so if it ever
  sounds abrupt, replace it with a longer recording of the same chant.

## Replacing it

Drop a new file in at the same path and the site picks it up — no code change.
To use a different filename, edit `AUDIO_TRACK_SRC` in `src/lib/site.ts`.

Keep it modest in size (it downloads on first page load) and normalise it fairly
quiet; the player starts at 35% volume.

## Licensing

Make sure the trust owns or is licensed to publish whatever recording sits here.
Many devotional recordings are copyrighted even when freely streamable.

## Playback behaviour

Browsers block audio that starts without user interaction, so the player:

1. remembers the visitor's last choice in `localStorage` (defaults to on),
2. attempts to play on load, and
3. if the browser refuses, retries on the visitor's first click, tap or
   keypress — until then the button shows "Tap anywhere to begin the chant".

Muting is remembered across visits and across page navigations.
