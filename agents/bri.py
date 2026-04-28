"""
BRI — INTEL & WEB RESEARCH AGENT
Apex Growth System | Fintek Mortgage | NMLS #2171794

Runs on schedule (see schedules/bri_schedule.py):
  - 7:00am daily    → NJ court records (divorce, probate, foreclosure)
  - 8:00am weekdays → LinkedIn relocator intercept (Apify)
  - 11:00pm nightly → Data arbitrage (ARM expirations, permits, deed transfers)
  - Tue/Thu 10am    → B2B2C partner list building

Output: logs/bri_YYYY-MM-DD.json + leads/bri_import_YYYY-MM-DD.csv (HubSpot-ready)
"""

import os
import json
import csv
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ─── CONFIG ───────────────────────────────────────────────────────────────────
APIFY_TOKEN      = os.environ.get('APIFY_TOKEN', '')
HUBSPOT_TOKEN    = os.environ.get('HUBSPOT_TOKEN', '')
LOG_DIR          = Path(__file__).parent.parent / 'logs'
LEADS_DIR        = Path(__file__).parent.parent / 'leads'
TODAY            = datetime.now().strftime('%Y-%m-%d')
DAY_OF_WEEK      = datetime.now().strftime('%A')  # Monday, Tuesday...

LOG_DIR.mkdir(exist_ok=True)
LEADS_DIR.mkdir(exist_ok=True)

# NJ employer targets for LinkedIn relocation intercept
NJ_EMPLOYERS = [
    'JPMorgan', 'Pfizer', 'Merck', 'Johnson & Johnson', 'Cognizant',
    'Prudential', 'ADP', 'Sanofi', 'Bayer', 'KPMG', 'Deloitte',
    'Samsung America', 'Panasonic', 'Subaru of America',
]

# ─── LOGGING ──────────────────────────────────────────────────────────────────
activity_log = {
    'agent': 'Bri',
    'date': TODAY,
    'runs': [],
    'leads_found': 0,
    'leads_by_type': {},
    'flags': [],
    'planned_tomorrow': [],
    'errors': [],
}

def log_run(task, leads_found, details, lead_type=None):
    activity_log['runs'].append({'task': task, 'leads': leads_found, 'details': details})
    activity_log['leads_found'] += leads_found
    if lead_type:
        activity_log['leads_by_type'][lead_type] = \
            activity_log['leads_by_type'].get(lead_type, 0) + leads_found

def log_error(task, error):
    activity_log['errors'].append({'task': task, 'error': str(error)})
    print(f'[Bri] ERROR in {task}: {error}')

def save_log():
    path = LOG_DIR / f'bri_{TODAY}.json'
    with open(path, 'w') as f:
        json.dump(activity_log, f, indent=2)
    print(f'[Bri] Log saved → {path}')

# ─── NJ OPEN DATA API ─────────────────────────────────────────────────────────
# Free Socrata API — data.nj.gov — no auth required
SOCRATA_BASE = 'https://data.nj.gov/resource'

def nj_open_data_get(dataset_id, params=None, limit=50):
    """Query NJ Open Data (Socrata) API."""
    url = f'{SOCRATA_BASE}/{dataset_id}.json'
    if params:
        url += '?' + urllib.parse.urlencode({**params, '$limit': limit})
    req = urllib.request.Request(url, headers={'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except Exception as e:
        return {'error': str(e)}

def get_recent_deed_transfers():
    """
    NJ deed transfers — new ownership = purchase or refi opportunity.
    Dataset: NJ property sales (varies by county — Union County example).
    """
    print('[Bri] Pulling recent deed transfers from NJ Open Data...')
    # Union County property transfers — adjust dataset IDs per county as needed
    # Full dataset catalog: https://data.nj.gov/browse?category=Housing+%26+Community+Development
    results = nj_open_data_get(
        'wkmv-9rwq',  # NJ residential property sales
        params={'$where': "sale_date > '" + (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d') + "'",
                '$order': 'sale_date DESC'}
    )
    if isinstance(results, list):
        leads = []
        for r in results[:20]:
            leads.append({
                'source': 'NJ Open Data — Deed Transfer',
                'address': r.get('property_location', ''),
                'city': r.get('municipality', ''),
                'sale_date': r.get('sale_date', ''),
                'sale_price': r.get('sale_price', ''),
                'segment': 'purchase_candidate',
                'intent': 'WARM',
                'source_url': f'https://data.nj.gov/resource/wkmv-9rwq.json',
            })
        log_run('deed_transfers', len(leads), f'Found {len(leads)} recent transfers', 'purchase_candidate')
        return leads
    else:
        log_error('deed_transfers', results.get('error', 'Unknown error'))
        return []

def get_construction_permits():
    """
    NJ construction permits > $50K → HELOC / cash-out refi candidates.
    Homeowners investing in improvements = equity + renovation financing opportunity.
    """
    print('[Bri] Pulling NJ construction permits > $50K...')
    results = nj_open_data_get(
        'w9se-dmra',  # NJ construction permit data
        params={'$where': "estimated_cost > '50000'",
                '$order': 'issue_date DESC'}
    )
    leads = []
    if isinstance(results, list):
        for r in results[:15]:
            leads.append({
                'source': 'NJ Open Data — Construction Permit',
                'address': r.get('street_address', ''),
                'city': r.get('municipality', ''),
                'permit_type': r.get('permit_type', ''),
                'cost': r.get('estimated_cost', ''),
                'segment': 'refi_candidate',
                'intent': 'WARM',
                'note': 'HELOC / cash-out candidate — active home improvement',
                'source_url': 'https://data.nj.gov/resource/w9se-dmra.json',
            })
        log_run('construction_permits', len(leads), f'Found {len(leads)} permits > $50K', 'refi_candidate')
    else:
        log_error('construction_permits', results.get('error', 'Unknown'))
    return leads

# ─── NJ COURTS (MANUAL QUEUE) ─────────────────────────────────────────────────
# njcourts.gov requires JS rendering — Bri queues records for manual pull
# and logs the search parameters Kate reports to Wael for action.

def queue_court_record_tasks():
    """
    NJ Courts public portal requires JS — queue research tasks for manual pull.
    Kate reports these in the briefing under ⚠️ FLAGS > Manual Action Needed.
    Full portal: https://portal.njcourts.gov/webe10/ECF_PublicAccess/
    """
    print('[Bri] Queuing NJ court record research tasks...')
    today_str = datetime.now().strftime('%m/%d/%Y')
    tasks = [
        {
            'court': 'Superior Court — Family Division',
            'type': 'Divorce Filing',
            'segment': 'refi_candidate',
            'intent': 'HOT',
            'action': f'Search njcourts.gov for divorce filings filed {today_str}. Export names + addresses.',
            'url': 'https://portal.njcourts.gov/webe10/ECF_PublicAccess/',
        },
        {
            'court': 'Chancery Division',
            'type': 'Foreclosure Filing',
            'segment': 'refi_candidate',
            'intent': 'HOT',
            'action': f'Search njcourts.gov Chancery Division for foreclosure filings {today_str}.',
            'url': 'https://portal.njcourts.gov/webe10/ECF_PublicAccess/',
        },
        {
            'court': 'Surrogate Court',
            'type': 'Probate / Estate',
            'segment': 'purchase_candidate',
            'intent': 'WARM',
            'action': f'Search njcourts.gov Surrogate Court for probate cases filed this week.',
            'url': 'https://portal.njcourts.gov/webe10/ECF_PublicAccess/',
        },
    ]
    activity_log['planned_tomorrow'].extend([t['action'] for t in tasks])
    log_run('nj_courts_queue', 0, f'Queued {len(tasks)} manual court research tasks', None)
    activity_log['flags'].append(
        f'[MANUAL ACTION] {len(tasks)} NJ court record searches queued — requires portal login at njcourts.gov'
    )
    return tasks

# ─── APIFY — LINKEDIN RELOCATOR INTERCEPT ─────────────────────────────────────
def run_linkedin_relocator_intercept():
    """
    Apify free tier — scrapes LinkedIn for NJ employer job changes.
    Intercepts within 48h of 'started new position' announcement.
    Requires APIFY_TOKEN env var.
    """
    if not APIFY_TOKEN:
        msg = 'APIFY_TOKEN not set — LinkedIn intercept skipped. Get token at apify.com/settings/integrations'
        print(f'[Bri] {msg}')
        activity_log['flags'].append(f'[CREDENTIAL NEEDED] {msg}')
        log_run('linkedin_intercept', 0, 'Skipped — no Apify token', None)
        return []

    print('[Bri] Running LinkedIn relocator intercept via Apify...')
    # Apify LinkedIn Profile Scraper actor
    actor_id = 'apify~linkedin-profile-scraper'
    url = f'https://api.apify.com/v2/acts/{actor_id}/runs'

    search_queries = [f'started new position {emp} New Jersey' for emp in NJ_EMPLOYERS[:5]]

    body = json.dumps({
        'queries': search_queries,
        'maxResults': 20,
    }).encode()

    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {APIFY_TOKEN}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            result = json.loads(r.read())
            run_id = result.get('data', {}).get('id', '')
            log_run('linkedin_intercept', 0, f'Apify run started: {run_id} — results async', 'purchase_candidate')
            activity_log['flags'].append(f'[APIFY] LinkedIn run {run_id} started — check apify.com for results')
            return result
    except Exception as e:
        log_error('linkedin_intercept', e)
        return []

# ─── HUBSPOT IMPORT ───────────────────────────────────────────────────────────
def push_leads_to_hubspot(leads):
    """
    Push collected leads to HubSpot via CRM Batch API.
    Tags each contact with Bri's segment and intent flags.
    """
    if not leads:
        return
    if not HUBSPOT_TOKEN:
        log_error('hubspot_push', 'HUBSPOT_TOKEN not set')
        return

    print(f'[Bri] Pushing {len(leads)} leads to HubSpot...')
    url = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/create'

    inputs = []
    for lead in leads[:100]:  # HubSpot batch limit
        props = {
            'address': lead.get('address', ''),
            'city': lead.get('city', ''),
            'hs_lead_status': lead.get('intent', 'WARM'),
            'lifecyclestage': 'lead',
        }
        # Map segment to custom properties
        if lead.get('note'):
            props['message'] = lead['note']
        inputs.append({'properties': props})

    body = json.dumps({'inputs': inputs}).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {HUBSPOT_TOKEN}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            result = json.loads(r.read())
            created = len(result.get('results', []))
            log_run('hubspot_push', created, f'Pushed {created} contacts to HubSpot')
            print(f'[Bri] HubSpot: {created} contacts created.')
    except Exception as e:
        log_error('hubspot_push', e)

def save_leads_csv(leads):
    """Save leads as CSV for manual HubSpot import if needed."""
    if not leads:
        return
    path = LEADS_DIR / f'bri_import_{TODAY}.csv'
    fieldnames = ['source', 'address', 'city', 'segment', 'intent', 'note', 'source_url']
    with open(path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(leads)
    print(f'[Bri] Leads CSV saved → {path}')

# ─── PLANNED TASKS FOR TOMORROW ───────────────────────────────────────────────
def set_planned_tasks():
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%A')
    plans = [f'Run NJ court record queue ({tomorrow} 7:00am)']
    if tomorrow in ('Tuesday', 'Thursday'):
        plans.append('B2B2C partner list building — attorneys, property managers, Arab Chamber')
    if tomorrow in ('Monday', 'Wednesday', 'Friday'):
        plans.append('Community data refresh — mosques, WhatsApp groups, Arabic orgs')
    plans.append('LinkedIn relocator intercept via Apify (8:00am)')
    plans.append('ARM expiration + deed transfer data arbitrage (11:00pm)')
    activity_log['planned_tomorrow'].extend(plans)

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print(f'[Bri] Starting intelligence run — {TODAY} ({DAY_OF_WEEK})')

    all_leads = []

    # Always run
    all_leads += get_recent_deed_transfers()
    all_leads += get_construction_permits()
    queue_court_record_tasks()

    # Weekdays only — LinkedIn intercept
    if DAY_OF_WEEK not in ('Saturday', 'Sunday'):
        run_linkedin_relocator_intercept()

    # Push to HubSpot + save CSV
    if all_leads:
        save_leads_csv(all_leads)
        push_leads_to_hubspot([l for l in all_leads if l.get('segment')])

    set_planned_tasks()
    save_log()

    print(f'[Bri] Run complete. Leads found: {activity_log["leads_found"]} | Flags: {len(activity_log["flags"])}')

if __name__ == '__main__':
    main()
