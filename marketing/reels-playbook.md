# TrackPass Dynamic Reels — Batch 2 Playbook

*Scoped 2026-07-02, before generation. Feel-good + fun, scripted to convert.
Format: multi-scene AI clips (Seedance via fal) stitched with capsule text beats.*

## Conversion logic (every reel follows this arc)

1. **0–2s HOOK** — emotional or curiosity beat, no brand. (Scroll-stopper: the
   algorithm decides distribution on 2-second retention.)
2. **2–8s FEELING** — the joy/relatability of muni golf. Warmth first, product never.
3. **8–14s TURN** — the price-math punchline lands as a *relief*, not a pitch.
4. **14–18s CTA** — capsule: `trackpassgolf.com` (+ caption repeats the offer with caps).

Rules: honest caps in every money claim ("up to $50/round, 1/mo, $199/yr cap");
AI people only as silhouettes/back-views/distance (no close AI faces — uncanny);
no named courses on AI footage; ambient audio ON for these (birds, club strike —
silent reels underperform on TikTok).

## The five scripts

### R1 — "First tee with dad" (feel-good, family)
- S1 (5s): Golden-hour wide shot, father and young son walking onto a modest
  municipal tee box, back view, carrying bags. → capsule: "golf memories don't
  need a country club"
- S2 (5s): Kid lines up a putt on a simple green, dad crouched behind, silhouettes,
  warm dusk. → "texas munis: $15-40 a round"
- S3 (5s): Ball drops, kid's arms up, dad laughing, backlit. → "trackpass pays
  the fee back — up to $50/round" → CTA capsule.
- Caption: "Best golf memories are made on munis. Up to $50 back per round
  (1/mo, $199/yr cap). #TexasGolf #GolfDad"

### R2 — "Saturday, 6:47am" (fun, ritual)
- S1 (4s): Dawn, golf bag loaded into a pickup truck bed, steam from a coffee cup
  on the tailgate. → "saturday, 6:47am"
- S2 (5s): Dew-covered fairway flyover, low sun, long shadows. → "the best $35
  you'll spend all week"
- S3 (5s): Slow-mo putt drops, fist pump silhouette. → "…and trackpass pays you
  back" → CTA.
- Caption: "The Saturday ritual just got cheaper. Up to $50 back/round, 1/mo,
  $199/yr cap. #GolfTok #TexasGolf"

### R3 — "The math" (punchy, quick cuts)
- S1 (4s): Driving-range ball tracer streaks at sunset (fast energy). → "green fee: $40"
- S2 (4s): Cart rolling down cart path, wind in flag. → "trackpass rebate: $40 back"
- S3 (5s): Ball rolls into cup, tight macro. → "today's round: basically free*" +
  small capsule: "*up to $50, 1/mo, $199/yr cap" → CTA.
- Caption: "Do the math. $199/yr pass, up to $199/yr back. #GolfMath #TexasGolf"

### R4 — "95 courses, one pass" (awe, bucket list)
- S1 (5s): Aerial over hill-country course, live oaks + limestone. → "hill country"
- S2 (5s): Aerial over piney east-Texas fairway, tall pines. → "piney woods"
- S3 (5s): Coastal course at golden hour, palms + water. → "the gulf" then
  "95 texas public courses. one $199 pass." → CTA.
- Caption: "Your Texas golf bucket list, one pass. 95 public courses.
  #TexasGolf #BucketList"

### R5 — "The group chat picked a date" (fun, social)
- S1 (5s): Four golfers walking a fairway together at dusk, laughing,
  back view wide shot. → "the group chat finally picked a date"
- S2 (5s): High-five over a sunk putt, silhouettes against orange sky. →
  "make the round cheaper: up to $50 back. each."
- S3 (4s): Carts rolling into sunset side by side. → CTA.
- Caption: "Round with the boys, minus the green-fee guilt. Up to $50
  back/round each (1/mo, $199/yr cap). #GolfBuddies #TexasGolf"

## Production & cost

- 15 scenes × ~4.6s avg × $0.3034/s (720p, audio on) ≈ **$21**, plus ~$4
  re-roll buffer → **top up fal to $25**.
- Assembly: ffmpeg concat + capsule overlays per scene (same Pillow pipeline),
  crossfade 0.3s between scenes, keep ambient audio.
- Review gate: contact sheet + all 5 stitched reels to Todd BEFORE any posting.
- On approval: append to TikTok queue + manifest (captions above), enters the
  daily rotation automatically.

## Measurement

- TikTok analytics: 2s retention + completion rate per concept — double down on
  the winning format next batch.
- PostHog: direct-traffic bumps in the hours after each post; FB reels carry
  `utm_source=facebook&utm_medium=reel`.
