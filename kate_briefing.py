"""
KATE — APEX DAILY BRIEFING SCRIPT
Runs at 6:45am daily via Cowork scheduled task.
Pulls HubSpot pipeline data, formats the Apex brief, sends via Resend.

Required env vars (set in ~/.zshrc or ~/.bash_profile):
  HUBSPOT_TOKEN   — HubSpot Private App token (crm.objects.contacts.read)
  RESEND_API_KEY  — Resend API key (re_...)
"""

import os
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone

# ─── CONFIG ───────────────────────────────────────────────────────────────────
HUBSPOT_TOKEN  = os.environ.get('HUBSPOT_TOKEN', '')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
TO_EMAIL       = 'AbuAliWael@icloud.com'
FROM_EMAIL     = 'kate@fintekmortgage.com'   # must be a verified Resend sender domain
PORTAL_ID      = '245970533'

# ─── HELPERS ──────────────────────────────────────────────────────────────────
def hs_get(path, params=None):
    """GET request to HubSpot CRM API v3."""
    base = f'https://api.hubapi.com{path}'
    if params:
        base += '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(base, headers={
        'Authorization': f'Bearer {HUBSPOT_TOKEN}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {'error': str(e), 'results': []}


def hs_search(object_type, filters, properties, limit=10):
    """POST search request to HubSpot CRM API v3."""
    url  = f'https://api.hubapi.com/crm/v3/objects/{object_type}/search'
    body = json.dumps({
        'filterGroups': [{'filters': filters}],
        'properties':   properties,
        'limit':        limit,
        'sorts':        [{'propertyName': 'createdate', 'direction': 'DESCENDING'}],
    }).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {HUBSPOT_TOKEN}',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {'error': str(e), 'results': []}


def send_email(subject, html_body):
    """Send email via Resend API."""
    url  = 'https://api.resend.com/emails'
    body = json.dumps({
        'from':    FROM_EMAIL,
        'to':      [TO_EMAIL],
        'subject': subject,
        'html':    html_body,
    }).encode()
    req = urllib.request.Request(url, data=body, headers={
        'Authorization': f'Bearer {RESEND_API_KEY}',
        'Content-Type':  'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {'error': str(e)}


# ─── DATA PULLS ───────────────────────────────────────────────────────────────
def get_new_contacts_24h():
    """All contacts created in the last 24 hours."""
    since_ms = int((datetime.now(timezone.utc) - timedelta(hours=24)).timestamp() * 1000)
    data = hs_search(
        'contacts',
        filters=[{
            'propertyName': 'createdate',
            'operator':     'GTE',
            'value':        str(since_ms),
        }],
        properties=['firstname', 'lastname', 'email', 'phone',
                    'loan_purpose', 'hs_lead_status', 'lifecyclestage', 'createdate'],
        limit=50,
    )
    return data.get('results', [])


def get_hot_leads(limit=3):
    """Contacts with high-intent lifecycle stage — MQL or SQL."""
    data = hs_search(
        'contacts',
        filters=[{
            'propertyName': 'lifecyclestage',
            'operator':     'IN',
            'value':        'marketingqualifiedlead;salesqualifiedlead',
        }],
        properties=['firstname', 'lastname', 'email', 'phone',
                    'loan_purpose', 'hs_lead_status', 'createdate'],
        limit=limit,
    )
    return data.get('results', [])


def get_pipeline_counts():
    """Total contacts by lifecycle stage."""
    stages = ['lead', 'marketingqualifiedlead', 'salesqualifiedlead', 'opportunity', 'customer']
    counts = {}
    for stage in stages:
        data = hs_search(
            'contacts',
            filters=[{'propertyName': 'lifecyclestage', 'operator': 'EQ', 'value': stage}],
            properties=['firstname'],
            limit=1,
        )
        counts[stage] = data.get('total', 0)
    return counts


# ─── BRIEFING FORMATTER ───────────────────────────────────────────────────────
def format_contact(c):
    p   = c.get('properties', {})
    name = f"{p.get('firstname','') or ''} {p.get('lastname','') or ''}".strip() or 'Unknown'
    purpose = p.get('loan_purpose', '') or '—'
    stage   = p.get('lifecyclestage', '') or '—'
    return f"<b>{name}</b> · {purpose} · Stage: {stage}"


def build_briefing_html(date_str, hot_leads, new_contacts, pipeline):
    hot_html = ''.join(
        f'<li style="padding:6px 0;border-bottom:1px solid #eee;">'
        f'<span style="color:#D4952A;font-weight:bold;">{i+1}.</span> {format_contact(c)}'
        f'</li>'
        for i, c in enumerate(hot_leads)
    ) or '<li style="color:#888;">No hot leads flagged today.</li>'

    new_html = ''.join(
        f'<li style="padding:4px 0;">{format_contact(c)}</li>'
        for c in new_contacts[:10]
    ) or '<li style="color:#888;">No new contacts in last 24h.</li>'

    pipeline_html = ''.join(
        f'<tr><td style="padding:4px 12px 4px 0;color:#555;">{stage.replace("marketingqualifiedlead","MQL").replace("salesqualifiedlead","SQL").title()}</td>'
        f'<td style="font-weight:bold;">{count}</td></tr>'
        for stage, count in pipeline.items()
    )

    return f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0B1F3A;">
      <div style="background:#0B1F3A;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:#D4952A;margin:0;font-size:18px;">⚡ APEX DAILY BRIEF</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">{date_str} · Prepared by Kate</p>
      </div>

      <div style="background:#fff;border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">

        <h2 style="color:#D4952A;font-size:14px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px;">
          🎯 Top Leads to Call Today
        </h2>
        <ul style="list-style:none;padding:0;margin:0 0 24px;">{hot_html}</ul>

        <h2 style="color:#0B1F3A;font-size:14px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px;">
          📥 New Leads — Last 24 Hours ({len(new_contacts)} total)
        </h2>
        <ul style="list-style:none;padding:0;margin:0 0 24px;">{new_html}</ul>

        <h2 style="color:#0B1F3A;font-size:14px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px;">
          📊 Pipeline Snapshot
        </h2>
        <table style="border-collapse:collapse;margin:0 0 24px;">{pipeline_html}</table>

        <div style="background:#F6F8FC;border-radius:6px;padding:14px 18px;border-left:4px solid #D4952A;">
          <p style="margin:0;font-size:13px;color:#0B1F3A;">
            <b>Kate's Call:</b> Focus on leads with loan_purpose set — they have intent.
            Any contact without a phone number needs a follow-up email to capture it.
          </p>
        </div>

        <div style="margin-top:20px;text-align:center;">
          <a href="https://app.hubspot.com/contacts/{PORTAL_ID}"
             style="background:#0B1F3A;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:bold;">
            Open HubSpot Pipeline →
          </a>
        </div>

        <p style="margin-top:20px;font-size:11px;color:#999;text-align:center;">
          Apex Growth System · Kate · NMLS #2171794 · fintekmortgage.com
        </p>
      </div>
    </div>
    """


# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    if not HUBSPOT_TOKEN:
        print('ERROR: HUBSPOT_TOKEN not set. Export it in your shell profile.')
        return
    if not RESEND_API_KEY:
        print('ERROR: RESEND_API_KEY not set. Export it in your shell profile.')
        return

    today     = datetime.now().strftime('%A, %B %-d, %Y')
    print(f'[Kate] Pulling data for {today}...')

    hot_leads    = get_hot_leads(3)
    new_contacts = get_new_contacts_24h()
    pipeline     = get_pipeline_counts()

    print(f'[Kate] Hot leads: {len(hot_leads)} | New contacts: {len(new_contacts)}')

    html    = build_briefing_html(today, hot_leads, new_contacts, pipeline)
    subject = f'⚡ APEX DAILY BRIEF — {today}'
    result  = send_email(subject, html)

    if result.get('id'):
        print(f'[Kate] Briefing sent successfully. Email ID: {result["id"]}')
    else:
        print(f'[Kate] Send error: {result}')


if __name__ == '__main__':
    main()
