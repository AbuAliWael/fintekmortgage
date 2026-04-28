"""
SAGE — CONTENT WRITING & COMPLIANCE AGENT
Apex Growth System | Fintek Mortgage | NMLS #2171794

Runs daily. Generates content calendar items, runs compliance gate,
queues approved content for Olga. Nothing ships without Sage's sign-off.

Content calendar:
  Monday     → NJ Rate Update (EN + AR)
  Wednesday  → Program Spotlight (80% Non-QM focus)
  Friday     → Client Question Answered (60s)
  Any day    → Fed/rate news reaction if major event detected

Output: logs/sage_YYYY-MM-DD.json + content/queue/YYYY-MM-DD/*.json
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

# ─── CONFIG ───────────────────────────────────────────────────────────────────
HEYGEN_API_KEY   = os.environ.get('HEYGEN_API_KEY', '')
HUBSPOT_TOKEN    = os.environ.get('HUBSPOT_TOKEN', '')
LOG_DIR          = Path(__file__).parent.parent / 'logs'
QUEUE_DIR        = Path(__file__).parent.parent / 'content' / 'queue'
TODAY            = datetime.now().strftime('%Y-%m-%d')
DAY_OF_WEEK      = datetime.now().strftime('%A')

LOG_DIR.mkdir(exist_ok=True)
QUEUE_DIR.mkdir(parents=True, exist_ok=True)

# ─── COMPLIANCE RULES ─────────────────────────────────────────────────────────
REQUIRED_DISCLOSURE = 'NMLS #2171794 | Licensed in NJ | Equal Housing Lender'

COMPLIANCE_RULES = [
    {
        'id': 'NMLS_DISCLOSURE',
        'description': 'Every ad/post must include NMLS #2171794, Licensed in NJ, Equal Housing Lender',
        'check': lambda text: 'NMLS #2171794' in text and 'Licensed in NJ' in text,
        'fix': lambda text: text + f'\n\n{REQUIRED_DISCLOSURE}',
    },
    {
        'id': 'NO_GUARANTEED_APPROVAL',
        'description': 'No guaranteed approval, everyone qualifies, best rates, lowest rates language',
        'banned': ['guaranteed approval', 'everyone qualifies', 'best rates', 'lowest rates',
                   'guaranteed', 'you will qualify', 'no one denied'],
        'check': lambda text: not any(b in text.lower() for b in
                                       ['guaranteed approval', 'everyone qualifies',
                                        'lowest rates', 'you will qualify', 'no one denied']),
    },
    {
        'id': 'NJ_LICENSE_ONLY',
        'description': 'Must not imply service to NY or CT borrowers',
        'check': lambda text: not any(phrase in text.lower() for phrase in
                                       ['new york clients', 'ny borrowers', 'connecticut',
                                        'ct clients', 'serving ny', 'serving ct']),
    },
    {
        'id': 'TILA_TRIGGER',
        'description': 'Specific rates/payments require TILA disclosure',
        'triggers': ['% APR', '% rate', 'monthly payment of', 'down payment of $', 'as low as %'],
        'disclosure': 'Rate shown is for illustrative purposes only. Contact for current rates and terms. NMLS #2171794.',
    },
    {
        'id': 'NO_REFERRAL_FEE_IMPLICATION',
        'description': 'RESPA §8 — No implied referral fees or kickbacks',
        'banned': ['referral fee', 'pay per referral', 'earn per referral', 'commission for referral'],
        'check': lambda text: not any(b in text.lower() for b in
                                       ['referral fee', 'pay per referral', 'earn per referral']),
    },
]

# ─── LOGGING ──────────────────────────────────────────────────────────────────
activity_log = {
    'agent': 'Sage',
    'date': TODAY,
    'content_produced': [],
    'compliance_flags': [],
    'compliance_kills': [],
    'rewrites': 0,
    'queued_for_olga': [],
    'planned_tomorrow': [],
    'errors': [],
}

def log_error(task, error):
    activity_log['errors'].append({'task': task, 'error': str(error)})
    print(f'[Sage] ERROR in {task}: {error}')

def save_log():
    path = LOG_DIR / f'sage_{TODAY}.json'
    with open(path, 'w') as f:
        json.dump(activity_log, f, indent=2)
    print(f'[Sage] Log saved → {path}')

# ─── COMPLIANCE GATE ──────────────────────────────────────────────────────────
def run_compliance_gate(content_item):
    """
    Mandatory compliance check on all content before it reaches Olga.
    Returns (passed: bool, content_item: dict, flags: list)
    """
    text = content_item.get('body', '') + ' ' + content_item.get('caption', '')
    flags = []
    modified = False

    for rule in COMPLIANCE_RULES:
        rule_id = rule['id']

        # Auto-fix: NMLS disclosure
        if rule_id == 'NMLS_DISCLOSURE':
            if not rule['check'](text):
                if 'fix' in rule:
                    content_item['body'] = rule['fix'](content_item.get('body', ''))
                    content_item['caption'] = content_item.get('caption', '') + f'\n{REQUIRED_DISCLOSURE}'
                    text = content_item['body'] + ' ' + content_item['caption']
                    flags.append({'rule': rule_id, 'action': 'AUTO_FIXED', 'detail': 'Added NMLS disclosure'})
                    modified = True
                else:
                    flags.append({'rule': rule_id, 'action': 'FLAG', 'detail': rule['description']})

        # Hard stops
        elif rule_id in ('NO_GUARANTEED_APPROVAL', 'NO_REFERRAL_FEE_IMPLICATION', 'NJ_LICENSE_ONLY'):
            if not rule['check'](text):
                flags.append({'rule': rule_id, 'action': 'KILL', 'detail': rule['description']})

        # TILA trigger words — add disclosure
        elif rule_id == 'TILA_TRIGGER':
            if any(t.lower() in text.lower() for t in rule.get('triggers', [])):
                content_item['body'] = content_item.get('body', '') + f'\n\n{rule["disclosure"]}'
                flags.append({'rule': rule_id, 'action': 'DISCLOSURE_ADDED', 'detail': 'TILA trigger word found'})
                modified = True

    killed = any(f['action'] == 'KILL' for f in flags)

    if flags:
        activity_log['compliance_flags'].extend(flags)
    if killed:
        activity_log['compliance_kills'].append(content_item.get('title', 'Untitled'))
    if modified:
        activity_log['rewrites'] += 1

    return not killed, content_item, flags

# ─── CONTENT CALENDAR ─────────────────────────────────────────────────────────
def get_todays_content_plan():
    """Return content items based on day of week."""
    plans = []

    if DAY_OF_WEEK == 'Monday':
        plans = [
            {
                'title': f'NJ Rate Update — {datetime.now().strftime("%B %d")}',
                'type': 'heygen_script',
                'language': 'EN',
                'platform': ['youtube', 'instagram_reels', 'facebook', 'linkedin', 'tiktok'],
                'duration': '30s',
                'body': (
                    f"Good morning NJ. This is Wael with Fintek Mortgage, NMLS 2171794. "
                    f"Here's your rate update for the week of {datetime.now().strftime('%B %d, %Y')}. "
                    f"30-year fixed rates are moving — if you're thinking about buying or refinancing in New Jersey, "
                    f"now is the time to talk. Book a free 30-minute call at calendly.com/abualiwael. "
                    f"I'm licensed in NJ and I specialize in Non-QM, self-employed, and ITIN loans. "
                    f"Let's find the right program for you.\n\nNMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
                'caption': (
                    f"📊 NJ Mortgage Rate Update — Week of {datetime.now().strftime('%B %d')} | "
                    f"Book a free call: calendly.com/abualiwael | "
                    f"NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
            },
            {
                'title': f'تحديث أسعار نيوجيرسي — {datetime.now().strftime("%d/%m")}',
                'type': 'heygen_script',
                'language': 'AR',
                'platform': ['whatsapp_status', 'instagram_reels', 'facebook'],
                'duration': '30s',
                'body': (
                    f"السلام عليكم. أنا وائل عبد الدايم من فينتك مورتج. "
                    f"تحديث أسعار الفائدة لهذا الأسبوع في نيوجيرسي. "
                    f"الأسعار متغيرة والفرصة موجودة للي بيفكر يشتري بيت أو يعمل refinance. "
                    f"احجز معايا محادثة مجانية 30 دقيقة على calendly.com/abualiwael. "
                    f"بشتغل في نيوجيرسي بس، ومتخصص في Non-QM وقروض ITIN والعاملين لحسابهم الخاص.\n\n"
                    f"NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
                'caption': 'تحديث أسعار الرهن العقاري في نيوجيرسي 📊 | NMLS #2171794 | Licensed in NJ',
            },
        ]

    elif DAY_OF_WEEK == 'Wednesday':
        # 80% Non-QM spotlight rotation
        programs_nonqm = ['Bank Statement Loan', 'ITIN Loan', 'DSCR Investor Loan',
                           'Self-Employed / 1099 Loan', 'Foreign National Loan', 'Asset Depletion Loan']
        week_num = datetime.now().isocalendar()[1]
        program = programs_nonqm[week_num % len(programs_nonqm)]

        plans = [
            {
                'title': f'Program Spotlight: {program}',
                'type': 'heygen_script',
                'language': 'EN',
                'platform': ['youtube', 'instagram_reels', 'facebook', 'linkedin', 'tiktok'],
                'duration': '60s',
                'body': (
                    f"If you've been told you don't qualify for a mortgage, you need to hear this. "
                    f"I'm Wael with Fintek Mortgage, and today I'm breaking down the {program}. "
                    f"This is one of the most powerful programs in NJ for people who don't fit the "
                    f"traditional W2 box. Whether you're self-employed, an investor, or new to the US — "
                    f"there is a loan designed for you. Book a free call at calendly.com/abualiwael "
                    f"and let's talk about your situation.\n\n"
                    f"NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
                'caption': (
                    f"💡 {program} — The loan banks won't tell you about. "
                    f"Book: calendly.com/abualiwael | NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
            }
        ]

    elif DAY_OF_WEEK == 'Friday':
        plans = [
            {
                'title': 'Client Question Friday',
                'type': 'heygen_script',
                'language': 'EN',
                'platform': ['youtube', 'instagram_reels', 'facebook', 'tiktok', 'linkedin'],
                'duration': '60s',
                'body': (
                    f"Someone asked me this week: 'Can I get a mortgage if I'm self-employed and my "
                    f"tax returns show low income?' The answer is YES — and here's how. "
                    f"With a Bank Statement loan, we use your actual bank deposits, not your tax returns. "
                    f"12 or 24 months of statements. No W2 needed. I've helped dozens of NJ business owners "
                    f"get approved this way. If that sounds like you, book a free call at "
                    f"calendly.com/abualiwael. Let's run the numbers.\n\n"
                    f"NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
                'caption': (
                    f"❓ 'Can I qualify self-employed?' YES — here's how. "
                    f"Book: calendly.com/abualiwael | NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
                ),
            }
        ]

    # Daily: LinkedIn post (every weekday)
    if DAY_OF_WEEK not in ('Saturday', 'Sunday'):
        plans.append({
            'title': f'LinkedIn Daily Post — {DAY_OF_WEEK}',
            'type': 'social_post',
            'language': 'EN',
            'platform': ['linkedin'],
            'body': (
                f"NJ homebuyers: The biggest myth I hear every week is that you need a W2 job to get approved. "
                f"Self-employed, 1099, investor, or new to the US — there are loan programs built for you. "
                f"I've been helping the NJ community navigate this for years. "
                f"Questions? My calendar is open: calendly.com/abualiwael\n\n"
                f"NMLS #2171794 | Licensed in NJ | Equal Housing Lender"
            ),
            'caption': '',
        })

    return plans

# ─── HEYGEN SCRIPT SUBMISSION ─────────────────────────────────────────────────
def submit_to_heygen(script_item):
    """
    Submit approved video script to HeyGen for avatar video generation.
    Requires HEYGEN_API_KEY env var.
    """
    if not HEYGEN_API_KEY:
        msg = 'HEYGEN_API_KEY not set — video submission skipped. Get key at heygen.com/settings'
        print(f'[Sage] {msg}')
        activity_log['errors'].append({'task': 'heygen_submit', 'error': msg})
        return None

    print(f'[Sage] Submitting script to HeyGen: {script_item["title"]}')
    url = 'https://api.heygen.com/v2/video/generate'
    body = json.dumps({
        'video_inputs': [{
            'character': {'type': 'avatar', 'avatar_id': 'Wael_custom'},
            'voice': {'type': 'text', 'input_text': script_item['body'],
                      'voice_id': 'en-US-WaelCustom'},
            'background': {'type': 'color', 'value': '#0B1F3A'},
        }],
        'dimension': {'width': 1080, 'height': 1920},  # Vertical for Reels/TikTok
        'caption': False,
    }).encode()

    req = urllib.request.Request(url, data=body, headers={
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            result = json.loads(r.read())
            video_id = result.get('data', {}).get('video_id', '')
            print(f'[Sage] HeyGen video queued: {video_id}')
            return video_id
    except Exception as e:
        log_error('heygen_submit', e)
        return None

# ─── QUEUE FOR OLGA ───────────────────────────────────────────────────────────
def queue_for_olga(content_item):
    """Write approved content to Olga's queue directory."""
    filename = f"{content_item['type']}_{content_item['language']}_{TODAY}.json"
    path = QUEUE_DIR / filename
    with open(path, 'w') as f:
        json.dump(content_item, f, indent=2, ensure_ascii=False)
    activity_log['queued_for_olga'].append(content_item['title'])
    print(f'[Sage] Queued for Olga: {content_item["title"]}')

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print(f'[Sage] Starting content run — {TODAY} ({DAY_OF_WEEK})')

    content_plan = get_todays_content_plan()
    print(f'[Sage] Content items planned today: {len(content_plan)}')

    for item in content_plan:
        # Run compliance gate
        passed, item, flags = run_compliance_gate(item)

        if not passed:
            print(f'[Sage] KILLED (compliance): {item["title"]}')
            continue

        # Log produced content
        activity_log['content_produced'].append({
            'title': item['title'],
            'type': item['type'],
            'language': item['language'],
            'platforms': item.get('platform', []),
            'compliance_flags': len(flags),
        })

        # Submit video scripts to HeyGen
        if item['type'] == 'heygen_script' and HEYGEN_API_KEY:
            video_id = submit_to_heygen(item)
            if video_id:
                item['heygen_video_id'] = video_id

        # Queue everything for Olga
        queue_for_olga(item)

    # Set tomorrow's plan
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%A')
    if tomorrow == 'Monday':
        activity_log['planned_tomorrow'].append('NJ Rate Update video — EN + AR (30s each)')
    elif tomorrow == 'Wednesday':
        activity_log['planned_tomorrow'].append('Non-QM program spotlight video (60s)')
    elif tomorrow == 'Friday':
        activity_log['planned_tomorrow'].append('Client question video (60s)')
    activity_log['planned_tomorrow'].append(f'LinkedIn daily post ({tomorrow})')

    save_log()

    print(f'[Sage] Run complete. Produced: {len(activity_log["content_produced"])} | '
          f'Queued: {len(activity_log["queued_for_olga"])} | '
          f'Compliance flags: {len(activity_log["compliance_flags"])} | '
          f'Kills: {len(activity_log["compliance_kills"])}')

if __name__ == '__main__':
    main()
