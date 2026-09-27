import json,re,subprocess,pathlib,datetime

ROOT=pathlib.Path(__file__).resolve().parents[1]
text=(ROOT/"cameras.js").read_text()
ids=sorted(set(re.findall(r"youtube-nocookie\.com/embed/([A-Za-z0-9_-]{6,})",text)))
results={}
for video_id in ids:
    url=f"https://www.youtube.com/watch?v={video_id}"
    p=subprocess.run(["yt-dlp","--quiet","--skip-download","--no-warnings","--print","%(id)s",url],capture_output=True,text=True,timeout=45)
    results[video_id]={"healthy":p.returncode==0 and video_id in p.stdout,"checked_at":datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00","Z")}
out={"schema":"window.source-health.v1","generated_at":datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00","Z"),"youtube":results}
(ROOT/"source-health.json").write_text(json.dumps(out,indent=2,sort_keys=True)+"\n")
print(json.dumps(out,indent=2))
