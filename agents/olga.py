"""
OLGA — PUBLISHING & EXECUTION AGENT
Apex Growth System | Fintek Mortgage | NMLS #2171794

Executes all approved content from Sage's queue. Never writes, never decides.
Reports all delivery results back to Kate's daily briefing.

Channels managed:
  - Email: Mailchimp (11 drip sequences) + Resend (transactional)
  - Social: Buffer (LinkedIn, Facebook, Instagram, TikTok)
  - Video: YouTube upload + distribution chain
  - HubSpot: Lead stage updates

Output: logs/olga_YYYY-MM-DD.json
"""

import os
import json
import urllib.request
import urllib.parse
import base64
from datetime import datetime, timedelta
from pathlib import Path

# ─── CONFIG ───────────────────────────────────────────────────────────────────
MAILCHIMP_API_KEY   = os.environ.get('MAILCHIMP_API_KEY', '')
MAILCHIMP_SERVER    = os.environ.get('MAILCHIMP_SERVER', 'us1')  # e.g. us1, us14
BUFFER_ACCESS_TOKEN = os.environ.get('BUFFER_ACCESS_TOKEN', '')
YOUTUBE_API_KEY     = os.environ.get('YOUTUBE_API_KEY', '')
HUBSPOT_TOKEN       = os.environ.get('HUBSPOT_TOKEN', '')

LOG_DIR   = Path(__file__).parent.parent / 'logs'
QUEUE_DIR = Path(__file__).parent.parent / 'content' / 'queue'
TODAY     = datetime.now().strftime('%Y-%m-%d')
DAY_OF_WEEK = datetime.now().strftime('%A')

LOG_DIR.mkdir(exist_ok=True)

# ─── LOGGING ──────────────────────────────────────────────────────────────────
activity_log = {
    'agent': 'Olga',
    'date': TODAY,
    'email': {
        'sequences_active': 0,
        'sends_24h': 0,
        'avg_open_rate': None,
        'avg_ctr': None,
        'bounces': 0,
        'unsubscribes': 0,
        'flags': [],
    },
    'social': {
        'posts_scheduled': 0,
        'posts_by_platform': {},
        'buffer_status': 'unknown',
    },
    'video': {
        'uploads_24h': 0,
        'youtube_status': 'unknown',
    },
    'hubspot': {
        'leads_advanced': 0,
        'bookings_24h': 0,
    },
    'queue_processed': [],
    'planned_tomorrow': [],
    'errors': [],
    'flags': [],
}

def log_error(task, error):
    activity_log['errors'].append({'task': task, 'error': str(error)})
    print(f'[Olga] ERROR in {task}: {error}')

def save_log():
    path = LOG_DIR / f'olga_{TODAY}.json'
    with open(path, 'w') as f:
        json.dump(activity_log, f, indent=2)
    print(f'[Olga] Log saved → {path}')

# ─── MAILCHIMP ────────────────────────────────────────────────────────────────
MAILCHIMP_SEQUENCES = [
    'divorce_refi_90day',
    'heir_probate_60day',
    'arm_urgency_30day',
    'nj_newcomer_60day',
    'post_close_referral',
    'realtor_partner',
    'cpa_referral',
    'b2b2c_partner_quarterly',
    'community_event_followup',
    'nonqm_education_45day',
    'general_warm_6month',
]

def get_mailchimp_reports():
    """Pull last 24h campaign stats from Mailchimp."""
    if not MAILCHIMP_API_KEY:
        msg = 'MAILCHIMP_API_KEY not set — email reporting skipped. Get key at mailchimp.com/account/api'
        print(f'[Olga] {msg}')
        activity_log['flags'].append(f'[CREDENTIAL NEEDED] {msg}')
        return

    print('[Olga] Pulling Mailchimp campaign reports...')
    auth = base64.b64encode(f'any:{MAILCHIMP_API_KEY}'.encode()).decode()
    since = (datetime.now() - timedelta(hours=24)).strftime('%Y-%m-%dT%H:%M:%S+00:00')

    url = f'https://{MAILCHIMP_SERVER}.api.mailchimp.com/3.0/reports?since_send_time={urllib.parse.quote(since)}&count=20'
    req = urllib.request.Request(url, headers={
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            reports = data.get('reports', [])
            activity_log['email']['sequences_active'] = len(MAILCHIMP_SEQUENCES)
            activity_log['email']['sends_24h'] = sum(r.get('emails_sent', 0) for r in reports)

            open_rates = [r.get('opens', {}).get('open_rate', 0) for r in reports if r.get('opens')]
            ctrs       = [r.get('clicks', {}).get('click_rate', 0) for r in reports if r.get('clicks')]
            bounces    = sum(r.get('bounces', {}).get('hard_bounces', 0) for r in reports)
            unsubs     = sum(r.get('unsubscribes', 0) for r in reports)

            if open_rates:
                activity_log['email']['avg_open_rate'] = round(sum(open_rates) / len(open_rates) * 100, 1)
            if ctrs:
                activity_log['email']['avg_ctr'] = round(sum(ctrs) / len(ctrs) * 100, 1)
            activity_log['email']['bounces'] = bounces
            activity_log['email']['unsubscribes'] = unsubs

            # Flag high bounce rate
            if bounces > 0:
                total_sends = activity_log['email']['sends_24h'] or 1
                bounce_rate = bounces / total_sends
                if bounce_rate > 0.02:
                    activity_log['email']['flags'].append(
                        f'HIGH BOUNCE RATE: {bounce_rate:.1%} — investigate list quality'
                    )
                    activity_log['flags'].append(f'[EMAIL FLAG] Bounce rate {bounce_rate:.1%} exceeds 2% threshold')

            print(f'[Olga] Mailchimp: {len(reports)} campaigns | '
                  f'Open rate: {activity_log["email"]["avg_open_rate"]}% | '
                  f'CTR: {activity_log["email"]["avg_ctr"]}%')
    except Exception as e:
        log_error('mailchimp_reports', e)

# ─── BUFFER ───────────────────────────────────────────────────────────────────
def get_buffer_analytics():
    """Pull Buffer scheduling queue and recent analytics."""
    if not BUFFER_ACCESS_TOKEN:
        msg = 'BUFFER_ACCESS_TOKEN not set — social reporting skipped. Get token at buffer.com/account/apps'
        print(f'[Olga] {msg}')
        activity_log['flags'].append(f'[CREDENTIAL NEEDED] {msg}')
        return

    print('[Olga] Pulling Buffer analytics...')
    # Try Bearer auth first, fall back to query param
    for auth_method in ['bearer', 'query']:
        if auth_method == 'bearer':
            url = 'https://api.bufferapp.com/1/profiles.json'
            req = urllib.request.Request(url, headers={
                'Authorization': f'Bearer {BUFFER_ACCESS_TOKEN}',
                'Content-Type': 'application/json',
            })
        else:
            url = f'https://api.bufferapp.com/1/profiles.json?access_token={BUFFER_ACCESS_TOKEN}'
            req = urllib.request.Request(url, headers={'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                profiles = json.loads(r.read())
                activity_log['social']['buffer_status'] = 'connected'
                by_platform = {}
                for p in profiles:
                    service = p.get('service', 'unknown')
                    by_platform[service] = {
                        'id': p.get('id'),
                        'username': p.get('formatted_username', ''),
                        'follower_count': p.get('statistics', {}).get('followers', 0),
                    }
                activity_log['social']['posts_by_platform'] = by_platform
                print(f'[Olga] Buffer ({auth_method}): {len(profiles)} profiles — {list(by_platform.keys())}')
                break  # success — stop trying
        except urllib.error.HTTPError as e:
            detail = e.read().decode('utf-8', errors='replace')
            log_error(f'buffer_analytics_{auth_method}', f'HTTP {e.code}: {detail[:200]}')
        except Exception as e:
            log_error(f'buffer_analytics_{auth_method}', e)

def schedule_post_via_buffer(content_item):
    """Schedule a social post via Buffer API."""
    if not BUFFER_ACCESS_TOKEN:
        return None

    platforms = content_item.get('platform', [])
    buffer_services = {
        'linkedin': 'linkedin',
        'facebook': 'facebook',
        'instagram': 'instagram',
        'twitter': 'twitter',
    }

    scheduled = 0
    text = content_item.get('caption', '') or content_item.get('body', '')[:280]

    for platform in platforms:
        service = buffer_services.get(platform)
        if not service:
            continue

        url = 'https://api.bufferapp.com/1/updates/create.json'
        body = urllib.parse.urlencode({
            'text': text,
            'now': 'false',  # Add to queue
        }).encode()

        req = urllib.request.Request(url, data=body, headers={
            'Authorization': f'Bearer {BUFFER_ACCESS_TOKEN}',
        })
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                result = json.loads(r.read())
                if result.get('success'):
                    scheduled += 1
                    print(f'[Olga] Scheduled on {platform}: {content_item["title"][:40]}')
        except urllib.error.HTTPError as e:
            detail = e.read().decode('utf-8', errors='replace')
            log_error(f'buffer_schedule_{platform}', f'HTTP {e.code}: {detail[:200]}')
        except Exception as e:
            log_error(f'buffer_schedule_{platform}', e)

    return scheduled

# ─── YOUTUBE ──────────────────────────────────────────────────────────────────
def get_youtube_stats():
    """Pull YouTube channel stats for last 24h."""
    if not YOUTUBE_API_KEY:
        msg = 'YOUTUBE_API_KEY not set — YouTube stats skipped. Provide Google API credentials.'
        print(f'[Olga] {msg}')
        activity_log['flags'].append(f'[CREDENTIAL NEEDED] {msg}')
        return

    print('[Olga] Pulling YouTube analytics...')
    # YouTube Data API v3 — channel stats
    url = (f'https://www.googleapis.com/youtube/v3/channels'
           f'?part=statistics&mine=true&key={YOUTUBE_API_KEY}')
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read())
            channel = data.get('items', [{}])[0].get('statistics', {})
            activity_log['video']['youtube_status'] = 'connected'
            activity_log['video']['subscriber_count'] = channel.get('subscriberCount', 0)
            activity_log['video']['total_views'] = channel.get('viewCount', 0)
            print(f'[Olga] YouTube: {channel.get("subscriberCount", 0)} subscribers')
    except Exception as e:
        log_error('youtube_stats', e)

# ─── PROCESS SAGE'S QUEUE ─────────────────────────────────────────────────────
def process_content_queue():
    """Read all approved content from Sage's queue and schedule via Buffer."""
    queue_files = list(QUEUE_DIR.glob(f'*_{TODAY}.json'))
    if not queue_files:
        print('[Olga] No content in queue for today.')
        return

    print(f'[Olga] Processing {len(queue_files)} items from Sage queue...')
    total_scheduled = 0

    for f in queue_files:
        try:
            with open(f) as fp:
                item = json.load(fp)

            # Skip HeyGen scripts (video — handled separately when video is ready)
            if item.get('type') == 'heygen_script':
                activity_log['queue_processed'].append({
                    'title': item.get('title'),
                    'status': 'PENDING_VIDEO — awaiting HeyGen render',
                })
                continue

            # Schedule social posts
            scheduled = schedule_post_via_buffer(item)
            if scheduled is not None:
                total_scheduled += scheduled
                activity_log['social']['posts_scheduled'] += scheduled
                activity_log['queue_processed'].append({
                    'title': item.get('title'),
                    'status': f'SCHEDULED — {scheduled} platforms',
                    'platforms': item.get('platform', []),
                })
        except Exception as e:
            log_error(f'queue_item_{f.name}', e)

    print(f'[Olga] Queue processed. {total_scheduled} posts scheduled via Buffer.')

# ─── HUBSPOT PIPELINE CHECK ───────────────────────────────────────────────────
def check_hubspot_pipeline():
    """Check for Calendly bookings and lead stage advances in last 24h."""
    if not HUBSPOT_TOKEN:
        return

    print('[Olga] Checking HubSpot pipeline activity...')
    since_ms = int((datetime.now() - timedelta(hours=24)).timestamp() * 1000)

    url = 'https://api.hubapi.com/crm/v3/objects/contacts/search'
    body = json.dumps({
        'filterGroups': [{'filters': [{
            'propertyName': 'hs_lastmodifieddate',
            'operator': 'GTE',
            'value': str(since_ms),
        }]}],
        'properties': ['firstname', 'lastname', 'lifecyclestage', 'hs_lead_status'],
        'limit': 50,
    }).encode()

    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {HUBSPOT_TOKEN}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            contacts = data.get('results', [])
            activity_log['hubspot']['leads_advanced'] = len(contacts)
            print(f'[Olga] HubSpot: {len(contacts)} contacts updated in last 24h')
    except Exception as e:
        log_error('hubspot_pipeline', e)

# ─── PLANNED TASKS FOR TOMORROW ───────────────────────────────────────────────
def set_planned_tasks():
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%A')
    plans = [f'Process Sage queue for {tomorrow}']
    if tomorrow in ('Monday', 'Wednesday', 'Friday'):
        plans.append(f'Distribute HeyGen video across all channels when render completes')
    plans.append('Pull Mailchimp + Buffer reports')
    plans.append('HubSpot pipeline update check')
    activity_log['planned_tomorrow'].extend(plans)

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print(f'[Olga] Starting execution run — {TODAY} ({DAY_OF_WEEK})')

    get_mailchimp_reports()
    get_buffer_analytics()
    get_youtube_stats()
    check_hubspot_pipeline()
    process_content_queue()
    set_planned_tasks()
    save_log()

    print(f'[Olga] Run complete. '
          f'Email sends: {activity_log["email"]["sends_24h"]} | '
          f'Social posts: {activity_log["social"]["posts_scheduled"]} | '
          f'Flags: {len(activity_log["flags"])}')

if __name__ == '__main__':
    main()
