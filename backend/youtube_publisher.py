"""
YouTube Publisher
Uploads HeyGen-rendered videos to Wael's YouTube channel automatically.
Handles Arabic videos + English videos with Arabic subtitle captions.
50/50 split: Arabic spoken / English spoken with Arabic subtitles.
"""
import os, json, logging, textwrap
import urllib.request, urllib.parse
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

CREDENTIALS_PATH = "/workspace/state/youtube-oauth-credentials.json"
TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
CAPTIONS_URL = "https://www.googleapis.com/upload/youtube/v3/captions"

AVATAR_ID    = "512421d1507747bdbe50cbe514312739"
VOICE_AR     = "61a4359785664d01a59664ceb87ce6d4"   # Hakeem Hassan — Arabic
VOICE_EN     = "a0bd2e5d41a74643be47ac75ca9171a2"   # Rami Idris — English

# ── Video metadata templates ──────────────────────────────────────────────────

ARABIC_TEMPLATES = {
    "script_01": {
        "title": "كيف تشتري منزلاً في نيوجيرسي بدون دفعة أولى كبيرة؟ | وائل عبد الدايم",
        "description": "وائل عبد الدايم — وسيط رهن عقاري مرخص في نيوجيرسي (NMLS #2171794)\n\n✅ برامج FHA للمشترين لأول مرة\n✅ الموافقة المسبقة في يوم واحد\n✅ خدمة بالعربية والإنجليزية\n\n📅 احجز مجاناً: https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender",
        "tags": ["رهن عقاري نيوجيرسي","شراء منزل نيوجيرسي","mortgage NJ","first time home buyer NJ","Arabic mortgage broker NJ","وائل عبد الدايم","FHA loan NJ"],
        "language": "ar",
    },
    "script_02": {
        "title": "قروض بدون إقرارات ضريبية لأصحاب الأعمال في NJ | Bank Statement Loans",
        "description": "وائل عبد الدايم (NMLS #2171794) يشرح Bank Statement Loans و DSCR Loans.\n\n✅ لا إقرارات ضريبية مطلوبة\n✅ للعاملين لحسابهم الخاص في NJ وNY وCT\n\n📅 https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender",
        "tags": ["bank statement loan NJ","self employed mortgage NJ","Non-QM loans","قرض بدون إقرارات ضريبية","DSCR loan NJ","وائل عبد الدايم"],
        "language": "ar",
    },
    "script_03": {
        "title": "الكريدت سكور: كل ما تحتاج معرفته قبل شراء البيت | نيوجيرسي",
        "description": "وائل عبد الدايم (NMLS #2171794) يشرح كيف يؤثر الكريدت سكور على قرضك العقاري.\n\n📅 https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender",
        "tags": ["credit score mortgage NJ","كريدت سكور","mortgage credit NJ","وائل عبد الدايم","improve credit score"],
        "language": "ar",
    },
}

ENGLISH_TEMPLATES = {
    "script_en_01": {
        "title": "How to Buy Your First Home in NJ with Low Down Payment | Wael Abdeldayem",
        "description": "Wael Abdeldayem, licensed NJ mortgage broker (NMLS #2171794), explains first-time buyer programs in New Jersey.\n\n✅ FHA loans — 3.5% down\n✅ Down payment assistance programs\n✅ Same-day pre-approval\n✅ Arabic & English service\n\n📅 Free consult: https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender\n[Arabic subtitles available — turn on CC]",
        "tags": ["first time home buyer NJ","NJ mortgage broker","FHA loan New Jersey","low down payment mortgage","Wael Abdeldayem","fintekmortgage","home buying NJ"],
        "language": "en",
        "arabic_subtitle": True,
    },
    "script_en_02": {
        "title": "Self-Employed? You CAN Get a Mortgage in NJ — No Tax Returns Needed",
        "description": "Wael Abdeldayem (NMLS #2171794) explains bank statement loans and Non-QM programs for self-employed borrowers in NJ, NY & CT.\n\n✅ Bank Statement Loans — qualify on deposits\n✅ DSCR Loans — investment properties\n✅ No tax returns required\n\n📅 https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender\n[Arabic subtitles available — turn on CC]",
        "tags": ["self employed mortgage NJ","bank statement loan","Non-QM mortgage","no tax return mortgage","NJ mortgage broker","Wael Abdeldayem","DSCR loan"],
        "language": "en",
        "arabic_subtitle": True,
    },
    "script_en_03": {
        "title": "Investment Property in NJ — DSCR Loans Explained | No W2 Required",
        "description": "Wael Abdeldayem (NMLS #2171794) explains how DSCR loans let you qualify for investment properties in NJ based on rental income — not your personal income.\n\n✅ No W2, no tax return\n✅ Multi-family, short-term rentals, out-of-state investors\n✅ Close in 3 weeks\n\n📅 https://calendly.com/abualiwael/30min\n📞 (917) 304-0234\n🌐 https://fintekmortgage.com\n\nBarrett Financial Group | NMLS #2171794 | Equal Housing Lender\n[Arabic subtitles available — turn on CC]",
        "tags": ["DSCR loan NJ","investment property NJ","rental property mortgage","no W2 mortgage","NJ real estate investing","Wael Abdeldayem","fintekmortgage"],
        "language": "en",
        "arabic_subtitle": True,
    },
}

VIDEO_TEMPLATES = {**ARABIC_TEMPLATES, **ENGLISH_TEMPLATES}


def _get_access_token():
    with open(CREDENTIALS_PATH) as f:
        creds = json.load(f)
    data = urllib.parse.urlencode({
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(TOKEN_URL, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())["access_token"]


def _generate_arabic_srt(english_script: str) -> str:
    """
    Generates an Arabic SRT subtitle file by translating the English script
    into timed subtitle blocks using the Anthropic API.
    Falls back to a simple untimed placeholder if API unavailable.
    """
    try:
        import anthropic
        client = anthropic.Anthropic()
        msg = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            messages=[{
                "role": "user",
                "content": f"""Translate this English mortgage script into Arabic and format it as an SRT subtitle file.
Split into ~15-20 subtitle blocks, each 3-5 seconds. Number them sequentially.
Use standard SRT format: number, timecode (00:00:00,000 --> 00:00:05,000), text, blank line.

English script:
{english_script}

Return ONLY the SRT content, no explanation."""
            }]
        )
        return msg.content[0].text
    except Exception as e:
        logger.warning(f"Could not generate Arabic subtitles via Claude: {e}")
        return ""


async def upload_video_to_youtube(db, video_path: str, script_id: str,
                                   title: str = None, description: str = None,
                                   tags: list = None, script_text: str = "") -> dict:
    template = VIDEO_TEMPLATES.get(script_id, {})
    title       = title or template.get("title", f"Fintek Mortgage — {script_id}")
    description = description or template.get("description", "")
    tags        = tags or template.get("tags", [])
    language    = template.get("language", "ar")
    add_subs    = template.get("arabic_subtitle", False)

    try:
        access_token = _get_access_token()
        boundary = "fintek_yt_boundary"

        metadata = {
            "snippet": {
                "title": title,
                "description": description,
                "tags": tags,
                "categoryId": "22",
                "defaultAudioLanguage": language,
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False,
            }
        }

        metadata_bytes = json.dumps(metadata).encode("utf-8")
        with open(video_path, "rb") as vf:
            video_bytes = vf.read()

        body = (
            f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"
        ).encode() + metadata_bytes + (
            f"\r\n--{boundary}\r\nContent-Type: video/mp4\r\n\r\n"
        ).encode() + video_bytes + f"\r\n--{boundary}--".encode()

        url = f"{UPLOAD_URL}?uploadType=multipart&part=snippet,status"
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": f"multipart/related; boundary={boundary}",
            "Content-Length": str(len(body)),
        })
        with urllib.request.urlopen(req, timeout=300) as r:
            result = json.loads(r.read())

        video_id  = result["id"]
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        logger.info(f"Uploaded: {title} → {youtube_url}")

        # Upload Arabic subtitles for English videos
        if add_subs and script_text:
            srt_content = _generate_arabic_srt(script_text)
            if srt_content:
                await _upload_captions(access_token, video_id, srt_content)

        # Record in MongoDB
        if db:
            await db.youtube_uploads.insert_one({
                "video_id": video_id,
                "script_id": script_id,
                "title": title,
                "youtube_url": youtube_url,
                "language": language,
                "arabic_subtitles": add_subs,
                "uploaded_at": datetime.now(timezone.utc),
                "status": "public",
            })

        return {"success": True, "video_id": video_id, "url": youtube_url}

    except Exception as e:
        logger.error(f"YouTube upload failed: {e}")
        return {"success": False, "error": str(e)}


async def _upload_captions(access_token: str, video_id: str, srt_content: str):
    """Upload Arabic subtitle track to a YouTube video."""
    try:
        boundary = "fintek_caption_boundary"
        meta = json.dumps({
            "snippet": {
                "videoId": video_id,
                "language": "ar",
                "name": "Arabic",
                "isDraft": False,
            }
        }).encode()
        srt_bytes = srt_content.encode("utf-8")

        body = (
            f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"
        ).encode() + meta + (
            f"\r\n--{boundary}\r\nContent-Type: text/plain\r\n\r\n"
        ).encode() + srt_bytes + f"\r\n--{boundary}--".encode()

        url = f"{CAPTIONS_URL}?uploadType=multipart&part=snippet"
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": f"multipart/related; boundary={boundary}",
            "Content-Length": str(len(body)),
        })
        with urllib.request.urlopen(req, timeout=30) as r:
            resp = json.loads(r.read())
        logger.info(f"Arabic subtitles uploaded for {video_id}: {resp.get('id')}")
    except Exception as e:
        logger.warning(f"Caption upload failed (non-fatal): {e}")


async def publish_heygen_video(db, heygen_video_id: str, script_id: str,
                                download_path: str = "/tmp",
                                script_text: str = "") -> dict:
    """Download completed HeyGen video and publish to YouTube."""
    HEYGEN_KEY = "sk_V2_hgu_kJix3zNQbTG_mUd5gNqN0KrTZvqcqmGMeHgmF8Vo49Hb"

    req = urllib.request.Request(
        f"https://api.heygen.com/v1/video_status.get?video_id={heygen_video_id}",
        headers={"X-Api-Key": HEYGEN_KEY}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        status = json.loads(r.read())

    video_url = status.get("data", {}).get("video_url")
    if not video_url:
        return {"success": False, "error": "Video not ready"}

    video_path = os.path.join(download_path, f"{heygen_video_id}.mp4")
    urllib.request.urlretrieve(video_url, video_path)

    result = await upload_video_to_youtube(db, video_path, script_id, script_text=script_text)

    try:
        os.remove(video_path)
    except Exception:
        pass

    return result
