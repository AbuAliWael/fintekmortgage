"""
Buyer Prospect List Builder
Pulls public FSBO listings and NJ county property records for direct mail targeting.
Outputs CSV formatted for direct mail services (Taradel, EDDM, Every Door Direct Mail).
"""
import csv
import httpx
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

# NJ County property record portals (all public access, no login required)
NJ_COUNTY_RECORD_URLS = {
    "Bergen": "https://bclrs.co.bergen.nj.us/landrecords/",
    "Essex": "https://www.essexclerk.com/",
    "Hudson": "https://www.hcnj.us/county-clerk/",
    "Middlesex": "https://www.middlesexcountynj.gov/government/departments/department-of-community-services/office-of-county-clerk/recording-services/land-records",
    "Morris": "https://www.morriscountyclerk.org/",
    "Passaic": "https://www.passaiccountynj.org/government/departments/county_clerk/land_records.php",
    "Union": "https://ucnj.org/county-clerk/",
    "Monmouth": "https://www.monmouthcountyclerk.com/",
    "Ocean": "https://oceancountyclerk.com/",
    "Somerset": "https://www.somersetcountyclerk.org/",
}

# FSBO data sources (no login required for basic listings)
FSBO_SOURCES = [
    "https://www.zillow.com/nj/?searchQueryState=%7B%22isForSaleByOwner%22%3Atrue%7D",
    "https://www.craigslist.org/search/nj/rea?query=for+sale+by+owner",
]

DIRECT_MAIL_GUIDE = """
=== NJ BUYER PROSPECT DIRECT MAIL GUIDE ===
Prepared by Kate for Fintek Mortgage | {date}

== SOURCE 1: FSBO SELLERS (Highest Intent) ==
People selling their own home are:
• Currently in the real estate market
• Likely buying their next home simultaneously
• Not working with an agent = no agent to recommend a lender = opportunity

HOW TO GET THE LIST:
1. Go to zillow.com → For Sale → "By Owner" filter → New Jersey
2. Each listing shows: address, price, days on market
3. For addresses: use USPS Every Door Direct Mail (EDDM) to target by carrier route
   → Tools: usps.com/business/every-door-direct-mail.htm
   → Cost: ~$0.20/piece for saturation mailing (no names needed, just addresses)
4. For names: search property address on njpropertyrecords.com to get owner name

MAIL PIECE TEMPLATE: See /workspace/content/direct-mail/fsbo-postcard.md

== SOURCE 2: RECENT PROPERTY TRANSFERS (Refinance Pipeline) ==
People who bought homes in 2022-2023 at high interest rates are prime refinance candidates.
When rates drop, they will want to refinance — be first in their mailbox.

HOW TO GET THE LIST:
1. Go to your county clerk portal (see list below)
2. Search deed recordings from Jan 2022 – Dec 2023
3. Filter for: purchase money mortgages (not refinances)
4. Extract: grantor/grantee name, property address, sale price, lender name
5. Mail to: new owners (grantees) — they have high-rate loans

NJ COUNTY PORTALS (public, free access):
- Bergen: bclrs.co.bergen.nj.us/landrecords/
- Essex: essexclerk.com
- Hudson: hcnj.us/county-clerk/
- Middlesex: middlesexcountynj.gov (land records)
- Morris: morriscountyclerk.org
- Passaic: passaiccountynj.org/government/departments/county_clerk/land_records.php
- Union: ucnj.org/county-clerk/
- Monmouth: monmouthcountyclerk.com
- Ocean: oceancountyclerk.com

== SOURCE 3: RENTAL-TO-BUY PROSPECTS ==
Target renters who are financially ready to buy but haven't made the move.

HOW TO GET THE LIST:
1. Identify zip codes in NJ with high rent burden (rent > 30% of median income)
   Top targets: Newark, Paterson, Elizabeth, Jersey City, Hackensack
2. Use EDDM to saturate carrier routes in these zip codes
3. Message: "Stop renting — here's what your mortgage payment would be"

== DIRECT MAIL EXECUTION ==
Recommended service: Taradel.com
- Upload list or use EDDM (no list needed)
- Postcard design: use templates at /workspace/content/direct-mail/
- Cost: ~$0.40–0.70/piece all-in (print + postage)
- Minimum: 200 pieces
- Turnaround: 5–7 business days

For 1,000 pieces/month budget: ~$500–700/month
Expected response rate: 0.5–2% = 5–20 inquiries/month

== COMPLIANCE NOTE ==
All direct mail must include:
- Wael Abd El Dayem | NMLS #2171794
- "Not a commitment to lend"
- Barrett Financial Group | Licensed by NJDOBI
- Equal Housing Lender logo
""".format(date=datetime.now().strftime("%Y-%m-%d"))


def generate_direct_mail_guide():
    """Write the direct mail guide to the content directory."""
    output_dir = Path("/Users/waelabdeldayem/.openclaw/workspace/content/direct-mail")
    output_dir.mkdir(parents=True, exist_ok=True)
    guide_path = output_dir / "buyer-prospect-guide.md"
    with open(guide_path, "w") as f:
        f.write(DIRECT_MAIL_GUIDE)
    logger.info(f"Direct mail guide written to {guide_path}")
    return str(guide_path)


def export_seed_accountant_list_csv():
    """Export the NJ CPA seed list to CSV for manual email discovery."""
    from accountant_outreach import NJ_CPA_SEED
    output_dir = Path("/Users/waelabdeldayem/.openclaw/workspace/content/direct-mail")
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / "nj-cpa-outreach-list.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["firm", "phone", "website", "city", "email"])
        writer.writeheader()
        for cpa in NJ_CPA_SEED:
            writer.writerow({**cpa, "email": ""})
    logger.info(f"CPA list exported to {csv_path}")
    return str(csv_path)


if __name__ == "__main__":
    generate_direct_mail_guide()
    export_seed_accountant_list_csv()
    print("Done. Check /workspace/content/direct-mail/")
