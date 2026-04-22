"""
Accountant Outreach System
Sends 10 Non-QM pitch emails/day to NJ CPAs via Resend.
Tracks sent status in MongoDB. RESPA compliant — no compensation offered.
"""
import os
import logging
import resend
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)

# Seed list of NJ CPA firms — scraped from public directories
NJ_CPA_SEED = [
    {"firm": "Angelo Gallo, CPA", "phone": "973-636-2800", "website": "cpagallo.com", "city": "NJ"},
    {"firm": "Anthony J. Cucciniello, CPA", "phone": "973-214-7909", "website": "ajc-cpa.com", "city": "NJ"},
    {"firm": "Bedford Tax Services", "phone": "732-739-2632", "website": "bedfordtaxservices.com", "city": "NJ"},
    {"firm": "Belbol & Associates", "phone": "201-523-9442", "website": "belbolcpa.com", "city": "NJ"},
    {"firm": "Edward J. Colville LLC", "phone": "908-367-9005", "website": "ejcolvillecpa.com", "city": "NJ"},
    {"firm": "Gaines & Associates, PC", "phone": "732-906-9277", "website": "gainescpacfo.com", "city": "NJ"},
    {"firm": "James M. Sausmer CPA LLC", "phone": "732-261-7710", "website": "jimsausmercpa.com", "city": "NJ"},
    {"firm": "JG CPA LLC", "phone": "201-396-7323", "website": "jgcpa-llc.com", "city": "NJ"},
    {"firm": "Magone & Company, P.C.", "phone": "973-301-2300", "website": "magonecpas.com", "city": "NJ"},
    {"firm": "Martin R. Hoffman, CPA LLC", "phone": "973-699-3872", "website": "martinhoffmancpa.com", "city": "NJ"},
    {"firm": "Michael DiPede, CPA", "phone": "732-290-9900", "website": "mdipedecpa.com", "city": "NJ"},
    {"firm": "Rizick & Rizick CPAs", "phone": "732-387-0872", "website": "rizickcpas.com", "city": "NJ"},
    {"firm": "Russikoff LLC", "phone": "973-564-8080", "website": "russikoffllc.com", "city": "NJ"},
    {"firm": "SnareFoti LLP", "phone": "908-431-9307", "website": "SnareFoti.com", "city": "NJ"},
    {"firm": "THT Tax and Accounting", "phone": "973-403-1040", "website": "thttaxandaccounting.com", "city": "NJ"},
    {"firm": "Urbach & Avraham, CPAs", "phone": "732-777-1158", "website": "ua-cpas.com", "city": "NJ"},
    {"firm": "123 Accounting Services LLC", "phone": "610-849-2400", "website": "123accountingservices.net", "city": "NJ"},
]

NON_QM_EMAIL_TEMPLATE = """Subject: Helping Your Self-Employed Clients Buy a Home — No Tax Returns Required

Hi {firm_name},

I'm Wael Abd El Dayem, a licensed mortgage broker in NJ (NMLS #2171794) specializing in Non-QM loans for self-employed borrowers.

Many of your clients are highly profitable but struggle to qualify for a mortgage because traditional lenders rely on tax returns — and aggressive write-offs make their income look low on paper.

I offer:
• Bank Statement Loans — qualify using 12-24 months of deposits, no tax returns
• P&L Loans — qualify using a CPA-prepared profit & loss statement
• DSCR Loans — for investment properties, qualify on cash flow, not personal income
• ITIN Loans — for non-US citizens with Individual Tax Identification Numbers

When your self-employed clients want to buy or refinance a home, I can help them qualify — even when traditional lenders say no.

This isn't a referral fee arrangement. I simply want to be your go-to mortgage resource so your clients get the financing they need.

Happy to send over a one-page Non-QM product guide, or schedule a 15-minute call.

Wael Abd El Dayem
Licensed Mortgage Broker | NJ | NMLS #2171794
Barrett Financial Group
(917) 304-0234 | fintekmortgage.com

This email was sent to {firm_website}. To opt out of future emails, reply with "unsubscribe."
Barrett Financial Group | Licensed by NJDOBI | Not a commitment to lend.
"""


async def seed_accountants(db):
    """Insert seed CPA list into MongoDB if collection is empty."""
    count = await db.accountants.count_documents({})
    if count == 0:
        docs = []
        for cpa in NJ_CPA_SEED:
            docs.append({
                **cpa,
                "email": None,
                "email_sent": False,
                "email_sent_at": None,
                "opted_out": False,
                "replied": False,
                "created_at": datetime.now(timezone.utc),
            })
        await db.accountants.insert_many(docs)
        logger.info(f"Seeded {len(docs)} NJ CPAs into accountants collection")


async def send_daily_accountant_emails(db):
    """
    APScheduler job: runs daily at 9am ET.
    Sends up to 10 Non-QM pitch emails to unsent, opted-out=False accountants.
    Only sends to accountants with a known email address.
    """
    if not os.environ.get("RESEND_API_KEY"):
        logger.warning("RESEND_API_KEY not set — skipping accountant outreach")
        return

    resend.api_key = os.environ["RESEND_API_KEY"]

    # Get next 10 unsent accountants that have emails
    cursor = db.accountants.find(
        {"email_sent": False, "opted_out": False, "email": {"$ne": None}}
    ).limit(10)
    accountants = await cursor.to_list(length=10)

    if not accountants:
        logger.info("No more accountants to email today")
        return

    sent_count = 0
    for acct in accountants:
        try:
            body = NON_QM_EMAIL_TEMPLATE.format(
                firm_name=acct["firm"],
                firm_website=acct.get("website", "your firm"),
            )
            resend.Emails.send({
                "from": "Wael Abd El Dayem <wael@fintekmortgage.com>",
                "to": [acct["email"]],
                "subject": "Helping Your Self-Employed Clients Buy a Home — No Tax Returns Required",
                "text": body,
            })
            await db.accountants.update_one(
                {"_id": acct["_id"]},
                {"$set": {"email_sent": True, "email_sent_at": datetime.now(timezone.utc)}}
            )
            sent_count += 1
            logger.info(f"Sent Non-QM pitch to {acct['firm']} ({acct['email']})")
        except Exception as e:
            logger.error(f"Failed to email {acct['firm']}: {e}")

    logger.info(f"Daily accountant outreach: {sent_count} emails sent")


async def add_accountant(db, firm: str, email: str, phone: str = "", city: str = "NJ", website: str = ""):
    """API endpoint helper: manually add an accountant to the outreach list."""
    existing = await db.accountants.find_one({"email": email})
    if existing:
        return {"status": "exists"}
    await db.accountants.insert_one({
        "firm": firm,
        "email": email,
        "phone": phone,
        "city": city,
        "website": website,
        "email_sent": False,
        "email_sent_at": None,
        "opted_out": False,
        "replied": False,
        "created_at": datetime.now(timezone.utc),
    })
    return {"status": "added"}
