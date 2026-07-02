# TrackPass AI Video Pipeline — Instructions & Plan

*Established 2026-07-02. First test batch: 3 clips, $7.30, all usable (1 needs re-roll).*

## Purpose

Generate golf b-roll for TikTok/IG Reels/FB video without owning footage.
AI video fills the **concept/hook slot** (price math, brand promise, "green fees
add up"); real course photos keep the **course-specific slot**. This split is a
hard rule, not a preference — see Guardrails.

## Guardrails (non-negotiable)

1. **AI footage is generic b-roll only.** Never pair an AI clip with a named
   course ("this is Hancock…"). That's the same fabrication class as the WFV
   fake-reviews incident. Course-specific reels use real photos from
   `assets/img/` (via `scripts/make-reels.py`).
2. **Overlay copy follows the capped-reimbursement rules**: up to $50/round,
   1 round/month, up to $199/yr back ($349 Family). Never "play free anywhere",
   never "unlimited".
3. **No AI people presented as members/testimonials.** Silhouettes and
   anonymous golfers as scenery = fine. "Here's what members say" = never.
4. **Todd reviews every batch** (contact sheet + clips) before anything posts.
5. **No third-party logos/likenesses in prompts** (no course names, no brands).

## Provider & Cost

- **Provider:** fal.ai (official ByteDance partner). Key at
  `~/.trackpass-secrets/fal-key.txt` (never in repo).
- **Endpoint:** `POST https://queue.fal.run/bytedance/seedance-2.0/text-to-video`
  Headers: `Authorization: Key <key>`, JSON body.
- **Params that work:** `resolution: "720p"`, `duration: "8"`,
  `aspect_ratio: "9:16"`, `generate_audio: false` (reels are silent + overlays).
- **Cost:** 720p = $0.3034/sec → **~$2.43 per 8s clip**. 1080p ($0.68/s) not
  worth it for phone feeds.
- **Budget cap: $15/month** (~5-6 clips incl. re-rolls). Top up at
  fal.ai/dashboard/billing. If volume ever exceeds ~50 clips/mo, move to
  BytePlus ModelArk direct (cheaper per-second, more onboarding).

## Prompt Playbook

Structure: `[camera move] + [subject] + [setting, Texas-flavored] + [light] + [style]`

Proven winners (test batch 2026-07-02):
- `Cinematic aerial drone flyover of a sun-drenched golf course fairway at golden hour, large live oak trees lining the fairway, warm Texas hill country light, smooth forward camera motion, photorealistic` ✅ excellent
- `Slow motion close-up of a golf ball rolling across a manicured putting green and dropping into the cup, low camera angle at grass level, early morning light, shallow depth of field, photorealistic` ✅ excellent
- `Wide shot of a golfer silhouette teeing off at sunset on a golf course, dramatic orange sky, ball flight visible against the sky, still camera, cinematic, photorealistic` ⚠️ good, but "ball flight visible" rendered a fake-looking blue tracer — **omit ball-flight language**, keep the swing only.

Lessons:
- "Texas hill country light" + "live oaks" reads authentically local without naming a course.
- Golden hour / sunrise prompts hide AI-render weaknesses; midday sun exposes them.
- One subject per clip. Compound scenes (golfer + cart + flag + dog) degrade.
- Re-roll anything with artifacts; at $2.43/clip a re-roll is cheaper than a bad post.

## Pipeline (per batch)

1. **Generate** — submit prompts to fal queue, poll, download
   (`scripts/gen-ai-broll.py` — see below).
2. **Review** — build contact sheet (3 frames/clip), Todd approves/rejects each.
3. **Overlay** — add hook text via the Pillow-overlay + ffmpeg pattern from
   `scripts/make-reels.py` (Arial Bold, stroke, yellow accent #fde047,
   hook top-third, CTA `$199/yr · trackpassgolf.com` bottom).
4. **Publish** — approved clips land in `assets/reels/` + `manifest.json`
   (git push → GH Pages). They automatically enter both rotations:
   - Worker reel post (IG + FB) Tue/Fri
   - `tiktok-poster.js` queue Mon/Wed/Fri (add entry with caption)
5. **Log spend** — note batch cost + date at the bottom of this file.

## Hook pairings (batch 1)

| Clip | Hook overlay | CTA |
|---|---|---|
| fairway-flyover | "Green fees add up." | "Get up to $199/yr of them back. · trackpassgolf.com" |
| ball-to-cup | "95 Texas public courses. One $199 pass." | "trackpassgolf.com" |
| sunset-teeoff (re-roll) | "Golf doesn't need a country club." | "$199/yr · trackpassgolf.com" |

## Cadence plan

- **Phase 1 (now):** finish batch 1 — re-roll sunset clip, overlay, Todd approves, queue.
- **Phase 2 (July):** 1 batch/month of 3-4 clips, prompts rotated seasonally
  (summer twilight golf, fall colors). Mix ratio in rotations: ~1 AI concept
  reel per 2 real-photo course reels.
- **Phase 3 (later, only if reels demonstrably outperform):** raise budget,
  consider BytePlus direct + image-to-video conditioned on our real course
  photos (animates actual courses — would relax the generic-only rule since
  the scenery IS the real course; revisit guardrail #1 then).

## Spend log

- 2026-07-02: $7.30 — batch 1 (3× 8s @ 720p). fairway-flyover ✅, ball-to-cup ✅, sunset-teeoff ⚠️ re-roll needed.
