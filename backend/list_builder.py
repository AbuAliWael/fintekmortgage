"""
Nightly List Builder
Finds new NJ accountants and corporate contacts via public directories.
Adds them to MongoDB so the daily email queue never runs dry.
"""
import re
import logging
import httpx
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')

# NJ CPA directory sources — public, no login required
CPA_DIRECTORY_URLS = [
    "https://njcpa.org/find-a-cpa",
    "https://www.yellowpages.com/new-jersey/cpa",
    "https://www.yellowpages.com/jersey-city-nj/cpa",
    "https://www.yellowpages.com/paterson-nj/cpa",
    "https://www.yellowpages.com/hackensack-nj/cpa",
    "https://www.yellowpages.com/newark-nj/cpa",
    "https://www.yellowpages.com/clifton-nj/cpa",
]

# NJ company HR contact sources
CORPORATE_DIRECTORY_URLS = [
    "https://www.yellowpages.com/new-jersey/human-resources",
    "https://www.yellowpages.com/jersey-city-nj/human-resources",
    "https://www.yellowpages.com/newark-nj/human-resources",
    "https://www.yellowpages.com/hackensack-nj/human-resources",
    "https://www.yellowpages.com/paterson-nj/human-resources",
]

# Blacklisted domains — avoid internal/noreply addresses
SKIP_DOMAINS = {"example.com", "sentry.io", "w3.org", "schema.org", "facebook.com",
                "twitter.com", "linkedin.com", "instagram.com", "google.com",
                "apple.com", "microsoft.com", "adobe.com", "amazonaws.com"}


def _clean_email(email: str) -> str | None:
    email = email.lower().strip()
    domain = email.split("@")[-1] if "@" in email else ""
    if domain in SKIP_DOMAINS:
        return None
    if any(kw in email for kw in ["noreply", "no-reply", "donotreply", "bounce", "unsubscribe"]):
        return None
    return email


def _extract_emails_from_html(html: str) -> list[str]:
    raw = EMAIL_RE.findall(html)
    cleaned = [_clean_email(e) for e in raw]
    return list(set(e for e in cleaned if e))


def _extract_name_from_html(html: str, url: str) -> tuple[str, str]:
    """Very simple: look for business name patterns near email addresses."""
    # Try to extract from title tag
    title_match = re.search(r'<title[^>]*>([^<]{3,80})</title>', html, re.IGNORECASE)
    name = title_match.group(1).strip() if title_match else url.split("/")[-1]
    # Clean up common suffixes
    name = re.sub(r'\s*[-|]\s*(Yellow Pages|Yelp|Google Maps|LinkedIn).*$', '', name, flags=re.IGNORECASE)
    return name.strip(), ""


async def build_accountant_list(db):
    """
    Scrapes public CPA directories. Adds new accountants with emails to MongoDB.
    Target: add 30+ new contacts per night to stay ahead of 20/day send queue.
    """
    added = 0
    async with httpx.AsyncClient(timeout=15, follow_redirects=True,
                                  headers={"User-Agent": "Mozilla/5.0 (compatible)"}) as client:
        for url in CPA_DIRECTORY_URLS:
            try:
                resp = await client.get(url)
                emails = _extract_emails_from_html(resp.text)

                # For each email found, check if it's a CPA/accounting firm
                for email in emails:
                    domain = email.split("@")[-1]
                    # Skip if already in DB
                    if await db.accountants.find_one({"email": email}):
                        continue

                    # Try to fetch their website for a name
                    firm_name = domain.replace(".com", "").replace("-", " ").title()
                    try:
                        site_resp = await client.get(f"https://{domain}", timeout=8)
                        name, _ = _extract_name_from_html(site_resp.text, domain)
                        if name and len(name) > 3:
                            firm_name = name
                    except Exception:
                        pass

                    await db.accountants.insert_one({
                        "firm": firm_name,
                        "first_name": "there",
                        "email": email,
                        "phone": "",
                        "city": "NJ",
                        "website": domain,
                        "arabic_priority": False,
                        "email_sent": False,
                        "email_sent_at": None,
                        "opted_out": False,
                        "replied": False,
                        "source": "list_builder",
                        "created_at": datetime.now(timezone.utc),
                    })
                    added += 1
                    if added >= 50:  # Cap per run to avoid spam
                        break
            except Exception as e:
                logger.debug(f"Could not scrape {url}: {e}")

    logger.info(f"List builder: added {added} new accountants to queue")
    return added


async def build_corporate_list(db):
    """
    Scrapes NJ company HR directories. Adds new corporate contacts to MongoDB.
    """
    added = 0
    HR_KEYWORDS = ['hr@', 'human.resources@', 'benefits@', 'careers@', 'people@']

    async with httpx.AsyncClient(timeout=15, follow_redirects=True,
                                  headers={"User-Agent": "Mozilla/5.0 (compatible)"}) as client:
        for url in CORPORATE_DIRECTORY_URLS:
            try:
                resp = await client.get(url)
                emails = _extract_emails_from_html(resp.text)
                hr_emails = [e for e in emails if any(kw in e for kw in HR_KEYWORDS)]

                for email in hr_emails:
                    if await db.corporate_contacts.find_one({"email": email}):
                        continue

                    domain = email.split("@")[-1]
                    company_name = domain.replace(".com", "").replace("-", " ").title()

                    await db.corporate_contacts.insert_one({
                        "company": company_name,
                        "first_name": "HR Team",
                        "email": email,
                        "city": "NJ",
                        "website": domain,
                        "hr_title": "HR Team",
                        "email_sent": False,
                        "email_sent_at": None,
                        "opted_out": False,
                        "replied": False,
                        "email_found": True,
                        "source": "list_builder",
                        "created_at": datetime.now(timezone.utc),
                    })
                    added += 1
                    if added >= 50:
                        break
            except Exception as e:
                logger.debug(f"Could not scrape {url}: {e}")

    logger.info(f"List builder: added {added} new corporate contacts to queue")
    return added


async def run_nightly_list_builder(db):
    """Master function — runs both builders nightly."""
    logger.info("Starting nightly list builder...")
    a_added = await build_accountant_list(db)
    c_added = await build_corporate_list(db)
    logger.info(f"Nightly build complete: {a_added} accountants + {c_added} corporate added")
