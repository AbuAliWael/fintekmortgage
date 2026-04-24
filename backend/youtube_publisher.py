"""
YouTube Publisher
Uploads HeyGen-rendered videos to Wael's YouTube channel automatically.
Handles title, description, tags, category, and privacy settings.
"""
import os, json, logging
import urllib.request, urllib.parse
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

CREDENTIALS_PATH = "/workspace/state/youtube-oauth-credentials.json"
TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
CHANNEL_ID = None  # fetched on first use

def _load_creds():
    with open(CREDENTIALS_PATH) as f:
        return json.load(f)

def _get_access_token():
    creds = _load_creds()
    data = urllib.parse.urlencode({
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(TOKEN_URL, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())["access_token"]

def _get_channel_id(access_token):
    url = "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {access_token}"})
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read())
    return data["items"][0]["id"]

# Arabic mortgage video metadata templates
VIDEO_TEMPLATES = {
    "script_01": {
        "title": "كيف تشتري منزلاً في نيوجيرسي بدون دفعة أولى كبيرة؟ | وائل عبد الدايم",
        "description": """في هذا الفيديو، وائل عبد الدايم — وسيط رهن عقاري مرخص في نيوجيرسي (NMLS #2171794) — يشرح كيف يمكنك شراء منزلك الأول في NJ بدفعة أولى منخفضة.

نتحدث عن:
✅ برامج FHA للمشترين لأول مرة
✅ برامج المساعدة في الدفعة الأولى في NJ
✅ الموافقة المسبقة في يوم واحد
✅ خدمة كاملة بالعربية والإنجليزية

📅 احجز استشارة مجانية: https://calendly.com/abualiwael/30min
📞 (917) 304-0234
🌐 https://fintekmortgage.com

Barrett Financial Group | NMLS #2171794 | Equal Housing Lender""",
        "tags": ["رهن عقاري نيوجيرسي", "شراء منزل نيوجيرسي", "mortgage NJ", "first time home buyer NJ", "Arabic mortgage broker NJ", "وائل عبد الدايم", "fintekmortgage", "FHA loan NJ", "دفعة أولى"],
        "category_id": "22",  # People & Blogs
        "language": "ar"
    },
    "script_02": {
        "title": "قروض بدون إقرارات ضريبية لأصحاب الأعمال في NJ | Bank Statement Loans",
        "description": """إذا كنت صاحب عمل أو تعمل لحسابك الخاص وتظن أنك لا تستطيع الحصول على قرض عقاري — هذا الفيديو لك.

وائل عبد الدايم (NMLS #2171794) يشرح:
✅ قروض كشف الحساب البنكي (Bank Statement Loans)
✅ التأهل باستخدام إيرادات العقارات (DSCR Loans)
✅ حلول للعاملين لحسابهم الخاص في NJ وNY وCT

📅 احجز مكالمة مجانية: https://calendly.com/abualiwael/30min
📞 (917) 304-0234
🌐 https://fintekmortgage.com

Barrett Financial Group | NMLS #2171794 | Equal Housing Lender""",
        "tags": ["bank statement loan NJ", "self employed mortgage NJ", "Non-QM loans", "قرض بدون إقرارات ضريبية", "mortgage for business owners", "DSCR loan NJ", "وائل عبد الدايم"],
        "category_id": "22",
        "language": "ar"
    },
    "script_03": {
        "title": "العقارات الاستثمارية في نيوجيرسي — كيف تمولها؟ | DSCR Loans",
        "description": """تريد شراء عقار استثماري في نيوجيرسي؟ وائل عبد الدايم يشرح DSCR Loans — القروض التي تتأهل بناءً على دخل العقار، لا دخلك الشخصي.

في هذا الفيديو:
✅ ما هو DSCR Loan؟
✅ كيف تتأهل بدون W2 أو إقرارات ضريبية
✅ العقارات الأفضل للاستثمار في NJ وNY وCT
✅ الإغلاق في 3 أسابيع

📅 احجز استشارة مجانية: https://calendly.com/abualiwael/30min
📞 (917) 304-0234
🌐 https://fintekmortgage.com

Barrett Financial Group | NMLS #2171794 | Equal Housing Lender""",
        "tags": ["DSCR loan NJ", "investment property NJ", "real estate investing NJ", "عقارات نيوجيرسي", "rental property loan", "وائل عبد الدايم", "fintekmortgage"],
        "category_id": "22",
        "language": "ar"
    }
}


async def upload_video_to_youtube(db, video_path: str, script_id: str,
                                   title: str = None, description: str = None,
                                   tags: list = None) -> dict:
    """
    Upload a video file to YouTube.
    Uses template metadata from VIDEO_TEMPLATES if not provided.
    Records upload in MongoDB.
    """
    template = VIDEO_TEMPLATES.get(script_id, {})
    title = title or template.get("title", f"Fintek Mortgage — {script_id}")
    description = description or template.get("description", "")
    tags = tags or template.get("tags", [])
    category_id = template.get("category_id", "22")

    try:
        access_token = _get_access_token()

        # Video metadata
        metadata = {
            "snippet": {
                "title": title,
                "description": description,
                "tags": tags,
                "categoryId": category_id,
                "defaultAudioLanguage": template.get("language", "ar"),
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False,
            }
        }

        # Multipart upload
        boundary = "fintek_upload_boundary"
        metadata_bytes = json.dumps(metadata).encode("utf-8")

        with open(video_path, "rb") as vf:
            video_bytes = vf.read()

        body = (
            f"--{boundary}\r\n"
            f"Content-Type: application/json; charset=UTF-8\r\n\r\n"
        ).encode() + metadata_bytes + (
            f"\r\n--{boundary}\r\n"
            f"Content-Type: video/mp4\r\n\r\n"
        ).encode() + video_bytes + f"\r\n--{boundary}--".encode()

        url = f"{UPLOAD_URL}?uploadType=multipart&part=snippet,status"
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": f"multipart/related; boundary={boundary}",
            "Content-Length": str(len(body)),
        })

        with urllib.request.urlopen(req, timeout=300) as r:
            result = json.loads(r.read())

        video_id = result.get("id")
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"

        # Record in MongoDB
        await db.youtube_uploads.insert_one({
            "video_id": video_id,
            "script_id": script_id,
            "title": title,
            "youtube_url": youtube_url,
            "uploaded_at": datetime.now(timezone.utc),
            "status": "public"
        })

        logger.info(f"Uploaded to YouTube: {title} → {youtube_url}")
        return {"success": True, "video_id": video_id, "url": youtube_url}

    except Exception as e:
        logger.error(f"YouTube upload failed: {e}")
        return {"success": False, "error": str(e)}


async def publish_heygen_video(db, heygen_video_id: str, script_id: str,
                                download_path: str = "/tmp") -> dict:
    """
    Download a completed HeyGen video and upload it to YouTube.
    Called after HeyGen render completes.
    """
    import os
    HEYGEN_API_KEY = "sk_V2_hgu_kJix3zNQbTG_mUd5gNqN0KrTZvqcqmGMeHgmF8Vo49Hb"

    # Get video download URL from HeyGen
    req = urllib.request.Request(
        f"https://api.heygen.com/v1/video_status.get?video_id={heygen_video_id}",
        headers={"X-Api-Key": HEYGEN_API_KEY}
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        status = json.loads(r.read())

    video_url = status.get("data", {}).get("video_url")
    if not video_url:
        return {"success": False, "error": "Video not ready or URL missing"}

    # Download video
    video_path = os.path.join(download_path, f"{heygen_video_id}.mp4")
    urllib.request.urlretrieve(video_url, video_path)
    logger.info(f"Downloaded HeyGen video to {video_path}")

    # Upload to YouTube
    result = await upload_video_to_youtube(db, video_path, script_id)

    # Cleanup
    try:
        os.remove(video_path)
    except Exception:
        pass

    return result
