#!/usr/bin/env python3
"""Generate AI golf b-roll via Seedance on fal.ai.

Usage: python3 scripts/gen-ai-broll.py "name1:prompt1" "name2:prompt2" ...
Outputs ai-<name>.mp4 + ai-contact-sheet.jpg in CWD. ~$2.43 per 8s clip.
Rules: generic b-roll only (marketing/ai-video-pipeline.md), Todd reviews
the contact sheet before anything is overlaid or published.
"""
import json, subprocess, sys, time, urllib.request

KEY = open("/Users/toddpeoples/.trackpass-secrets/fal-key.txt").read().strip()
ENDPOINT = "https://queue.fal.run/bytedance/seedance-2.0/text-to-video"
HDR = {"Authorization": f"Key {KEY}", "Content-Type": "application/json"}

def api(url, body=None):
    data = json.dumps(body).encode() if body else None
    return json.load(urllib.request.urlopen(
        urllib.request.Request(url, data=data, headers=HDR), timeout=60))

jobs = []
for arg in sys.argv[1:]:
    name, prompt = arg.split(":", 1)
    resp = api(ENDPOINT, {"prompt": prompt, "resolution": "720p",
                          "duration": "8", "aspect_ratio": "9:16",
                          "generate_audio": False})
    jobs.append({"name": name, **resp})
    print("queued", name, resp["request_id"])

pending = {j["name"]: j for j in jobs}
files = []
while pending:
    time.sleep(10)
    for name, j in list(pending.items()):
        s = api(j["status_url"])
        if s["status"] == "COMPLETED":
            url = api(j["response_url"])["video"]["url"]
            out = f"ai-{name}.mp4"
            urllib.request.urlretrieve(url, out)
            files.append(out)
            del pending[name]
            print("done", out)
        elif s["status"] not in ("IN_QUEUE", "IN_PROGRESS"):
            print("FAILED", name, s)
            del pending[name]

# contact sheet: 3 frames per clip
frames = []
for f in files:
    for t in (1, 4, 7):
        fr = f"f-{f[3:-4]}-{t}.jpg"
        subprocess.run(["ffmpeg", "-y", "-ss", str(t), "-i", f, "-frames:v", "1",
                        "-vf", "scale=240:-1", fr], capture_output=True)
        frames.append(fr)
if files:
    rows = []
    fc = ""
    for i in range(0, len(frames), 3):
        fc += f"[{i}][{i+1}][{i+2}]hstack=3[r{i//3}];"
        rows.append(f"[r{i//3}]")
    fc += "".join(rows) + f"vstack={len(rows)}" if len(rows) > 1 else fc.rstrip(";")
    args = sum([["-i", f] for f in frames], [])
    subprocess.run(["ffmpeg", "-y", *args, "-filter_complex", fc,
                    "ai-contact-sheet.jpg"], capture_output=True)
    print("contact sheet: ai-contact-sheet.jpg")
