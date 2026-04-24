"""
Accountant Outreach System
Sends 20 Non-QM pitch emails/day (weekdays only) to NJ/NYC CPAs via Resend.
Tracks sent status in MongoDB. RESPA compliant — no compensation offered.
"""
import os
import logging
import resend
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

CALENDLY_LINK = "https://calendly.com/abualiwael/30min"

ACCOUNTANT_EMAIL_TEMPLATE = """Subject: A Mortgage Resource for Your Self-Employed Clients — No Tax Returns Required

Dear {first_name},

My name is Wael Abdeldayem, and I'm a licensed mortgage broker specializing in alternative lending solutions for self-employed individuals and business owners in New Jersey and the greater New York area. I wanted to reach out because I believe we may be able to help each other serve a segment of clients that often falls through the cracks of conventional financing.

Many of your self-employed clients are building profitable businesses — but their tax returns, optimized to minimize liability, tell a very different story to a traditional lender. That gap is where I come in. I specialize in loan programs that don't require tax returns at all:

• Bank Statement Loans — qualify using 12–24 months of deposits, no tax returns
• DSCR Loans — for real estate investors, qualify on rental cash flow
• Asset-Based Loans — for clients with strong balance sheets
• ITIN Loans — for non-US citizens with Individual Tax Identification Numbers

My goal is simple: to be a trusted referral partner you can call when a client is ready to buy. I handle the mortgage side entirely — you continue doing what you do best. Your client relationship stays yours. I also provide bilingual service in both English and Arabic, which is a meaningful advantage for many clients in our region.

If you'd like to connect, you can grab a time directly on my calendar — 15 minutes, no pressure:

Book a quick call: {calendly_link}

Or simply reply to this email. There's no obligation — just two professionals looking out for the same clients.

Warm regards,

Wael Abdeldayem
Licensed Mortgage Broker | NMLS #2171794
Barrett Financial Group
fintekmortgage.com | (917) 304-0234
Serving NJ, NY & CT — English & Arabic

---
To unsubscribe from future emails, reply with "unsubscribe" in the subject line.
Barrett Financial Group | Licensed by NJDOBI | Not a commitment to lend.
"""

NJ_CPA_SEED = [
    {"firm": "Amr M. Ibrahim", "first_name": "Amr", "email": "info@cpapai.com", "city": "Clifton, NJ", "website": "cpapai.com", "arabic_priority": True},
    {"firm": "Ziad Abuhadba - Ramallah Agency", "first_name": "Ziad", "email": "ziadabuhadba@hotmail.com", "city": "Paterson, NJ", "website": "", "arabic_priority": True},
    {"firm": "Kevin A. Carestia CPA LLC", "first_name": "Kevin", "email": "kevin@carestiacpa.com", "city": "Oakland, NJ", "website": "carestiacpa.com", "arabic_priority": False},
    {"firm": "Gonzalez Accounting CPA", "first_name": "Ruben", "email": "rgonzalez@gonzalezaccounting.com", "city": "North Bergen, NJ", "website": "gonzalezaccountingcpa.com", "arabic_priority": False},
    {"firm": "The Marchese Group LLC", "first_name": "Ronald", "email": "info@tmgcpa.net", "city": "Ramsey, NJ", "website": "tmgcpa.net", "arabic_priority": False},
    {"firm": "Pogogeff & Company CPAs", "first_name": "Team", "email": "admin@pogandco.com", "city": "Fort Lee, NJ", "website": "pogandco.com", "arabic_priority": False},
    {"firm": "Wurdemann Pinto & Co LLC", "first_name": "Team", "email": "info@wurdtax.com", "city": "Hackensack, NJ", "website": "wurdtax.com", "arabic_priority": False},
    {"firm": "Four Brothers Financial LLC", "first_name": "Gary", "email": "G.Mehta@fourbrothersfinancial.com", "city": "Jersey City, NJ", "website": "fourbrothersfinancial.com", "arabic_priority": False},
    {"firm": "Becerra & Associates PA", "first_name": "Ray", "email": "ray@becerraassociates.com", "city": "Hoboken, NJ", "website": "becerraassociates.com", "arabic_priority": False},
    {"firm": "Marchionda & Ferrer Advisory", "first_name": "Joseph", "email": "cpa@marchiondaferrer.com", "city": "Clifton, NJ", "website": "marchiondaferrer.com", "arabic_priority": False},
    {"firm": "United Accounting & Financial Services LLC", "first_name": "Team", "email": "info@unitedaccountingservices.com", "city": "Clifton, NJ", "website": "unitedaccountingservices.com", "arabic_priority": True},
    {"firm": "Fortunato & Pirrello LLC", "first_name": "Bob", "email": "info@fandpcpa.com", "city": "Bloomfield, NJ", "website": "fandpcpa.com", "arabic_priority": False},
    {"firm": "FIRM1040", "first_name": "Team", "email": "hello@firm1040.com", "city": "Montclair, NJ", "website": "firm1040.com", "arabic_priority": False},
    {"firm": "Ahad & Co CPA", "first_name": "Ahad", "email": "info@ahadandco.com", "city": "Forest Hills, NY", "website": "ahadandco.com", "arabic_priority": False},
    {"firm": "Richards Accounting & Financial Services", "first_name": "Genroy", "email": "info@richardscpanyc.com", "city": "Brooklyn, NY", "website": "richardscpanyc.com", "arabic_priority": False},
    {"firm": "Arrowpoint Tax Services Inc", "first_name": "Team", "email": "info@arrowpointtax.com", "city": "Bronx, NY", "website": "arrowpointtax.com", "arabic_priority": False},
]


async def seed_accountants(db):
    """Insert seed CPA list into MongoDB if collection is empty."""
    count = await db.accountants.count_documents({})
    if count == 0:
        docs = []
        for cpa in NJ_CPA_SEED:
            docs.append({
                **cpa,
                "email_sent": False,
                "email_sent_at": None,
                "opted_out": False,
                "replied": False,
                "source": "seed",
                "created_at": datetime.now(timezone.utc),
            })
        await db.accountants.insert_many(docs)
        logger.info(f"Seeded {len(docs)} accountants into MongoDB")


def _is_weekday():
    return datetime.now(timezone.utc).weekday() < 5  # Mon=0 ... Fri=4


async def send_daily_accountant_emails(db):
    """Runs daily at 9am ET on weekdays. Sends up to 20 outreach emails."""
    if not _is_weekday():
        logger.info("Skipping accountant outreach — weekend")
        return

    if not os.environ.get("RESEND_API_KEY"):
        logger.warning("RESEND_API_KEY not set — skipping accountant outreach")
        return

    resend.api_key = os.environ["RESEND_API_KEY"]

    cursor = db.accountants.find(
        {"email_sent": False, "opted_out": False, "email": {"$ne": None}}
    ).sort("arabic_priority", -1).limit(20)
    accountants = await cursor.to_list(length=20)

    if not accountants:
        logger.info("Accountant queue empty — list builder will add more tonight")
        return

    sent_count = 0
    for acct in accountants:
        try:
            first_name = acct.get("first_name") or acct.get("firm", "there")
            body = ACCOUNTANT_EMAIL_TEMPLATE.format(
                first_name=first_name,
                calendly_link=CALENDLY_LINK,
            )
            resend.Emails.send({
                "from": "Wael Abdeldayem <wael@fintekmortgage.com>",
                "to": [acct["email"]],
                "subject": "A Mortgage Resource for Your Self-Employed Clients — No Tax Returns Required",
                "text": body,
            })
            await db.accountants.update_one(
                {"_id": acct["_id"]},
                {"$set": {"email_sent": True, "email_sent_at": datetime.now(timezone.utc)}}
            )
            sent_count += 1
            logger.info(f"Sent to {acct.get('firm')} ({acct['email']})")
        except Exception as e:
            logger.error(f"Failed to email {acct.get('firm')}: {e}")

    logger.info(f"Accountant outreach: {sent_count} emails sent today")


async def add_accountant(db, firm: str, email: str, first_name: str = "there",
                         phone: str = "", city: str = "NJ", website: str = "",
                         arabic_priority: bool = False):
    """Add a new accountant to the outreach queue."""
    if await db.accountants.find_one({"email": email}):
        return {"status": "exists"}
    await db.accountants.insert_one({
        "firm": firm, "first_name": first_name, "email": email,
        "phone": phone, "city": city, "website": website,
        "arabic_priority": arabic_priority,
        "email_sent": False, "email_sent_at": None,
        "opted_out": False, "replied": False,
        "source": "manual", "created_at": datetime.now(timezone.utc),
    })
    return {"status": "added"}
