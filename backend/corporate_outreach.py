"""
Corporate Employee Benefit Outreach System
Sends 20 preferred-lender pitch emails/day (weekdays only) to NJ company HR/Benefits teams.
Tracks sent status in MongoDB.
"""
import os
import re
import logging
import resend
import httpx
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

CALENDLY_LINK = "https://calendly.com/abualiwael/30min"

CORPORATE_EMAIL_TEMPLATE = """Subject: A Free Mortgage Benefit for Your Employees — No Cost or Admin Burden to You

Hi {first_name},

My name is Wael Abdeldayem, and I'm a licensed New Jersey mortgage broker with Barrett Financial Group. I work exclusively in the NJ/NYC metro area, and I'm reaching out because I'd like to offer your employees a free mortgage wellness benefit — including personalized homebuyer guidance and homebuyer education — at absolutely no cost to your company.

Here's what I can provide to your team: employees get access to one-on-one mortgage consultations and free "Lunch and Learn" homebuyer education seminars I host throughout the year. I'll also provide a custom one-page flyer and a simple employee portal link you can post on your intranet or benefits page — zero administrative burden on your HR team. You add it to the benefits calendar and I handle everything else.

This is especially meaningful right now. Many employees are thinking about homeownership for the first time or looking to refinance, and they don't know where to start. Having a trusted, local mortgage professional in their corner — at no cost to them or to your organization — is a genuinely useful benefit your team will remember.

One thing your employees will notice: I respond fast. Every inquiry gets a same-day response, and I stay available throughout the entire process. That responsiveness is something I take personally.

I'd love to schedule a quick 15-minute call to walk you through how it works. You can grab a time directly here — no back-and-forth needed:

Schedule a 15-minute call: {calendly_link}

In the meantime, your employees can start their application directly here:
https://181106.my1003app.com/2171794/register

Warm regards,

Wael Abdeldayem
Licensed Mortgage Broker | NJ
NMLS #2171794 | Barrett Financial Group NMLS #181106
fintekmortgage.com | (917) 304-0234

---
To unsubscribe from future emails, reply with "unsubscribe" in the subject line.
Barrett Financial Group | Licensed by NJDOBI | Not a commitment to lend.
"""

NJ_CORPORATE_SEED = [
    {"company": "Hackensack Meridian Health", "city": "Hackensack, NJ", "website": "hmhn.org", "email": None, "hr_title": "Benefits Manager"},
    {"company": "Bergen Community College", "city": "Paramus, NJ", "website": "bergen.edu", "email": "hr@bergen.edu", "hr_title": "Benefits Manager"},
    {"company": "Kean University", "city": "Union, NJ", "website": "kean.edu", "email": "hr@kean.edu", "hr_title": "Benefits Office"},
    {"company": "William Paterson University", "city": "Wayne, NJ", "website": "wpunj.edu", "email": None, "hr_title": "Benefits Manager"},
    {"company": "Passaic County Community College", "city": "Paterson, NJ", "website": "pccc.edu", "email": None, "hr_title": "HR Director"},
    {"company": "Bergen County Technical Schools", "city": "Paramus, NJ", "website": "bctech.net", "email": None, "hr_title": "HR Director"},
    {"company": "LG Electronics USA", "city": "Englewood Cliffs, NJ", "website": "lg.com/us", "email": None, "hr_title": "HR Benefits Director"},
    {"company": "Konica Minolta Business Solutions", "city": "Ramsey, NJ", "website": "konicaminolta.us", "email": None, "hr_title": "Benefits Manager"},
    {"company": "Quest Diagnostics", "city": "Secaucus, NJ", "website": "questdiagnostics.com", "email": None, "hr_title": "Benefits Manager"},
    {"company": "Broadridge Financial Solutions", "city": "Jersey City, NJ", "website": "broadridge.com", "email": None, "hr_title": "Benefits Director"},
    {"company": "Fabuwood Cabinetry Corp", "city": "Newark, NJ", "website": "fabuwood.com", "email": None, "hr_title": "HR Director"},
    {"company": "AvePoint", "city": "Jersey City, NJ", "website": "avepoint.com", "email": None, "hr_title": "HR Benefits Team"},
    {"company": "Jersey City Medical Center", "city": "Jersey City, NJ", "website": "rwjbh.org", "email": None, "hr_title": "HR Benefits Manager"},
    {"company": "Bergen New Bridge Medical Center", "city": "Paramus, NJ", "website": "bergenbridge.org", "email": None, "hr_title": "HR Director"},
    {"company": "The Children's Place", "city": "Secaucus, NJ", "website": "childrensplace.com", "email": None, "hr_title": "HR Benefits Director"},
    {"company": "Valley National Bank", "city": "Wayne, NJ", "website": "valley.com", "email": None, "hr_title": "HR Benefits"},
    {"company": "Dassault Falcon Jet", "city": "Teterboro, NJ", "website": "dassaultfalcon.com", "email": None, "hr_title": "HR Director"},
    {"company": "St. George Logistics", "city": "Kearny, NJ", "website": "stgeorgelogistics.com", "email": None, "hr_title": "HR Director"},
    {"company": "M. Tucker", "city": "Paterson, NJ", "website": "mtucker.com", "email": None, "hr_title": "HR Contact"},
    {"company": "Freshpet", "city": "Secaucus, NJ", "website": "freshpet.com", "email": None, "hr_title": "People & Culture Team"},
    {"company": "Accurate Box Company", "city": "Paterson, NJ", "website": "accuratebox.com", "email": None, "hr_title": "HR Manager"},
    {"company": "Bergen County Community Action Partnership", "city": "Hackensack, NJ", "website": "bcap-nj.org", "email": None, "hr_title": "HR Benefits Director"},
    {"company": "Gucci Americas HQ", "city": "Secaucus, NJ", "website": "gucci.com", "email": None, "hr_title": "HR Director"},
    {"company": "Treetop Companies", "city": "Teaneck, NJ", "website": "treetopcos.com", "email": None, "hr_title": "HR Contact"},
    {"company": "Uncommon Carrier", "city": "Kearny, NJ", "website": "uncommoncarrier.com", "email": None, "hr_title": "HR Manager"},
]


async def seed_corporate_contacts(db):
    """Insert seed corporate list into MongoDB if collection is empty."""
    count = await db.corporate_contacts.count_documents({})
    if count == 0:
        docs = []
        for company in NJ_CORPORATE_SEED:
            docs.append({
                **company,
                "first_name": "HR Team",
                "email_sent": False,
                "email_sent_at": None,
                "opted_out": False,
                "replied": False,
                "email_found": company["email"] is not None,
                "source": "seed",
                "created_at": datetime.now(timezone.utc),
            })
        await db.corporate_contacts.insert_many(docs)
        logger.info(f"Seeded {len(docs)} corporate contacts into MongoDB")


async def find_corporate_emails(db):
    """
    Nightly job: scrapes company websites to find HR/Benefits email addresses.
    Updates MongoDB records that have no email yet.
    """
    EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')
    HR_KEYWORDS = ['hr@', 'human.resources@', 'benefits@', 'careers@', 'people@', 'humanresources@']

    cursor = db.corporate_contacts.find({"email": None, "opted_out": False})
    companies = await cursor.to_list(length=100)

    async with httpx.AsyncClient(timeout=10, follow_redirects=True,
                                  headers={"User-Agent": "Mozilla/5.0"}) as client:
        for company in companies:
            website = company.get("website", "")
            if not website:
                continue
            try:
                url = f"https://{website}" if not website.startswith("http") else website
                # Try /contact and /about pages for HR emails
                for path in ["", "/contact", "/about", "/careers"]:
                    try:
                        resp = await client.get(url + path)
                        emails = EMAIL_RE.findall(resp.text)
                        hr_email = next(
                            (e for e in emails if any(kw in e.lower() for kw in HR_KEYWORDS)),
                            None
                        )
                        if hr_email:
                            await db.corporate_contacts.update_one(
                                {"_id": company["_id"]},
                                {"$set": {"email": hr_email, "email_found": True}}
                            )
                            logger.info(f"Found email for {company['company']}: {hr_email}")
                            break
                    except Exception:
                        continue
            except Exception as e:
                logger.debug(f"Could not scrape {website}: {e}")


def _is_weekday():
    return datetime.now(timezone.utc).weekday() < 5


async def send_daily_corporate_emails(db):
    """Runs daily at 9am ET on weekdays. Sends up to 20 corporate outreach emails."""
    if not _is_weekday():
        logger.info("Skipping corporate outreach — weekend")
        return

    if not os.environ.get("RESEND_API_KEY"):
        logger.warning("RESEND_API_KEY not set — skipping corporate outreach")
        return

    resend.api_key = os.environ["RESEND_API_KEY"]

    cursor = db.corporate_contacts.find(
        {"email_sent": False, "opted_out": False, "email": {"$ne": None}}
    ).limit(20)
    contacts = await cursor.to_list(length=20)

    if not contacts:
        logger.info("Corporate queue empty — email finder will update tonight")
        return

    sent_count = 0
    for contact in contacts:
        try:
            first_name = contact.get("first_name") or "HR Team"
            body = CORPORATE_EMAIL_TEMPLATE.format(
                first_name=first_name,
                calendly_link=CALENDLY_LINK,
            )
            resend.Emails.send({
                "from": "Wael Abdeldayem <wael@fintekmortgage.com>",
                "to": [contact["email"]],
                "subject": "A Free Mortgage Benefit for Your Employees — No Cost or Admin Burden to You",
                "text": body,
            })
            await db.corporate_contacts.update_one(
                {"_id": contact["_id"]},
                {"$set": {"email_sent": True, "email_sent_at": datetime.now(timezone.utc)}}
            )
            sent_count += 1
            logger.info(f"Sent to {contact['company']} ({contact['email']})")
        except Exception as e:
            logger.error(f"Failed to email {contact.get('company')}: {e}")

    logger.info(f"Corporate outreach: {sent_count} emails sent today")


async def add_corporate_contact(db, company: str, email: str, first_name: str = "HR Team",
                                 city: str = "NJ", website: str = "", hr_title: str = "HR Team"):
    """Add a new corporate contact to the outreach queue."""
    if await db.corporate_contacts.find_one({"email": email}):
        return {"status": "exists"}
    await db.corporate_contacts.insert_one({
        "company": company, "first_name": first_name, "email": email,
        "city": city, "website": website, "hr_title": hr_title,
        "email_sent": False, "email_sent_at": None,
        "opted_out": False, "replied": False,
        "email_found": True, "source": "manual",
        "created_at": datetime.now(timezone.utc),
    })
    return {"status": "added"}
