#!/usr/bin/env python3
"""Generate photo-motion reels (1080x1920, 15s) from course photos.

Output: assets/reels/reel-<id>.mp4 + assets/reels/manifest.json
Served on GH Pages so the worker can feed public URLs to the IG Reels API.
Copy rules: capped-reimbursement model only — never "free anywhere",
reimbursement always framed as up to $50/round, 1 round/month, $199/yr cap.
Partner benefit: 1 free round per year per course.
Style: TikTok-native capsules (Avenir Next Demi Bold, white on translucent
black pills) — matches the AI concept reels. AI reel entries in the existing
manifest (no courseId, custom caption) are preserved.

Usage: python3 scripts/make-reels.py            # courses w/ local photos
       python3 scripts/make-reels.py --force    # regenerate existing files
"""
import json, re, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "reels"
OUT.mkdir(exist_ok=True)
W, H = 1080, 1920
FORCE = "--force" in sys.argv

def font(sz):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Avenir Next.ttc", sz, index=2)
    except Exception:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", sz)

data = (ROOT / "assets" / "courses-data.js").read_text()
courses = json.loads(re.search(r"window\.TRACKPASS_COURSES = (\[.*?\]);", data, re.S).group(1))

def hooks(c):
    """Returns (top_lines, cta) — each line is (text, size)."""
    fee, city, name = c.get("fee") or 40, c["city"], c["name"]
    if c.get("partner"):
        return ([(f"{name.lower()}", 56), (f"partner course: 1 free round/year.", 48),
                 ("just show your pass.", 48)], "trackpassgolf.com · $199/yr")
    variants = [
        ([(f"{city.lower()} golf: ~${fee} a round", 54),
          ("trackpass pays you back up to $50", 46),
          ("(1 round/mo, up to $199/yr)", 42)], "trackpassgolf.com"),
        ([("green fees add up.", 58),
          ("get up to $199/yr of them back", 46),
          (f"like here — {name.lower()}", 42)], "trackpassgolf.com"),
        ([("95 texas public courses.", 54), ("one $199 pass.", 54),
          (f"{name.lower()} included", 42)], "trackpassgolf.com"),
    ]
    return variants[sum(map(ord, c["id"])) % len(variants)]

def capsule_line(d, txt, sz, y):
    f = font(sz)
    tw = d.textlength(txt, font=f)
    while tw > W - 120 and sz > 30:
        sz -= 2
        f = font(sz)
        tw = d.textlength(txt, font=f)
    pad_x, pad_y, r = 30, 18, 24
    x0 = (W - tw) / 2 - pad_x
    asc, desc = f.getmetrics()
    th = asc + desc
    d.rounded_rectangle([x0, y, x0 + tw + 2 * pad_x, y + th + 2 * pad_y],
                        radius=r, fill=(10, 10, 10, 165))
    d.text(((W - tw) / 2, y + pad_y), txt, font=f, fill=(255, 255, 255, 255))
    return y + th + 2 * pad_y + 16

def make_overlay(hook_lines, cta, path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    y = 430
    for txt, sz in hook_lines:
        y = capsule_line(d, txt, sz, y)
    capsule_line(d, cta, 40, 1580)
    img.save(path)

# preserve non-course entries (AI concept reels carry their own caption)
manifest_path = OUT / "manifest.json"
old = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
ai_entries = [e for e in old if not e.get("courseId")]

manifest = []
made = 0
for c in courses:
    photo = c.get("photo")
    if not photo:
        continue
    src = ROOT / photo
    if not src.exists():
        continue
    im = Image.open(src)
    if im.width < 700:                       # too soft for 1080 vertical
        continue
    out = OUT / f"reel-{c['id']}.mp4"
    if out.exists() and not FORCE:
        manifest.append({"file": f"assets/reels/{out.name}", "courseId": c["id"]})
        continue
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tf:
        top, cta = hooks(c)
        make_overlay(top, cta, tf.name)
        fc = ("[0:v]scale=1080:1920:force_original_aspect_ratio=increase,"
              "crop=1080:1920,"
              "zoompan=z='1.0+0.15*on/450':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              ":d=450:s=1080x1920:fps=30,format=yuv420p[bg];"
              "[bg][1:v]overlay=0:0,format=yuv420p")
        r = subprocess.run(["ffmpeg", "-y", "-loop", "1", "-i", str(src), "-i", tf.name,
                            "-filter_complex", fc, "-t", "15", "-r", "30",
                            "-c:v", "libx264", "-preset", "fast", "-crf", "24",
                            "-movflags", "+faststart", str(out)],
                           capture_output=True, text=True)
        if r.returncode != 0:
            print("FAIL", c["id"], r.stderr[-200:])
            continue
    manifest.append({"file": f"assets/reels/{out.name}", "courseId": c["id"]})
    made += 1
    print("made", out.name, c["name"])

# interleave AI concept reels between course reels (~1 per 2)
merged = []
ai = list(ai_entries)
for i, entry in enumerate(manifest):
    merged.append(entry)
    if ai and i % 2 == 1:
        merged.append(ai.pop(0))
merged.extend(ai)

manifest_path.write_text(json.dumps(merged, indent=1))
print(f"total reels: {len(merged)} (new: {made}, ai: {len(ai_entries)})")
