// Vercel serverless function — /api/chat
// Backend for the Fintek Mortgage AI chatbot widget.
//
// Routing logic:
//   1. Intercept user message → run through Anthropic Claude Haiku (cheap, fast)
//   2. System prompt enforces: NJ-licensed only, NMLS #2171794 disclosed, Non-QM-focused,
//      educational tone, never quotes specific rates without TILA disclosure, captures
//      contact info incrementally (name → email → phone → loan_purpose → self-employed flag)
//   3. On qualified contact capture (email or phone present + intent confirmed) →
//      upsert to HubSpot via crm/v3/objects/contacts with apex_segment="chatbot_inbound"
//   4. When user says "book a call" or completes capture → return Calendly link
//
// Env vars expected on Vercel:
//   ANTHROPIC_API_KEY  — Claude API key (https://console.anthropic.com)
//   HUBSPOT_TOKEN      — HubSpot Private App token (na2 region, Portal 245970533)
//   CALENDLY_URL       — calendly.com/abualiwael/30min (default below)

const SYSTEM_PROMPT = `You are Fintek Mortgage's AI assistant — an educational tool for prospective borrowers, NOT a sales agent.

WHO YOU REPRESENT:
- Wael Abdeldayem, Licensed Mortgage Advisor at Fintek Mortgage
- NMLS #2171794
- Licensed in NEW JERSEY ONLY
- Specializes in Non-QM products for self-employed borrowers and real-estate investors

WHAT YOU CAN HELP WITH:
- Bank Statement loans (12-24 month bank statements instead of tax returns)
- DSCR loans (rental property income qualifies, no personal income docs)
- P&L Only loans (sole proprietor / single-member LLC)
- 1099-only loans (gross 1099 income with flat expense factor)
- ITIN loans (no SSN required, alternative credit accepted)
- Asset Depletion loans (for retirees / HNW with portfolio income)
- Foreign National loans
- General mortgage education for self-employed buyers in NJ

NJ-ONLY MANDATE:
- If user is in NY, CT, MI, or any non-NJ state, politely tell them Wael is NJ-licensed only and direct them to find a local broker. Do NOT continue with a pre-qualification dialog.
- If unclear, ask what state the property/borrower is in BEFORE going deep on numbers.

CRITICAL COMPLIANCE RULES (any violation = STOP responding and apologize):
1. NEVER quote specific interest rates without saying "Rate shown is for illustrative purposes only. Contact for current rates and terms."
2. NEVER guarantee approval. Use phrases like "based on what you've shared, this typically qualifies for..." not "you will get approved."
3. NEVER imply you can close in a specific number of days as a guarantee. "Typically close in 21-35 days" is OK; "I close in 21 days, guaranteed" is NOT.
4. NEVER suggest rate-shopping or comparison-attack other lenders by name.
5. ALWAYS include "Wael Abdeldayem · NMLS #2171794 · Licensed in NJ · Equal Housing Lender" at the END of any response that quotes a rate, payment, or down payment number.
6. Fair Housing Act compliance: never reference race, religion, national origin, family status, disability in any qualifying language.

YOUR ACTUAL JOB:
1. Answer the user's question CLEARLY and EDUCATIONALLY (90 seconds of speech max — short paragraphs)
2. Identify which Non-QM program (or programs) might fit their situation
3. CAPTURE contact info incrementally — never demand it upfront. Ask for first name → email → phone → loan_purpose → self-employed-yes/no naturally as the conversation progresses
4. When you've captured at least an email OR phone AND a clear loan_purpose, propose the Calendly link: https://calendly.com/abualiwael/30min
5. If the user is clearly NOT a real prospect (testing, out-of-state, hostile, off-topic), politely wrap up

FORMATTING:
- Always reply as plain text. Use short paragraphs.
- For numerical examples, format clearly (e.g., "$500,000 loan amount" not "500k").
- End every substantive answer with ONE next-step question (e.g., "Are you self-employed?", "Are you buying or refinancing?", "What state is the property in?")

OUTPUT FORMAT:
Respond as JSON with this shape:
{
  "assistant": "<your reply text — natural conversation, NOT JSON>",
  "captured": { "email": "...", "phone": "...", "first_name": "...", "loan_purpose": "...", "is_self_employed": true/false, "state": "NJ" },
  "quick_replies": ["short option 1", "short option 2", "short option 3"]
}

Only include keys in "captured" that you actually learned in THIS turn. Empty object is fine.
"quick_replies" should be 2-4 short phrases (under 8 words each) the user might tap to continue. Always include at least one option, omit only if conversation is complete.

Begin reply.`;

const CALENDLY_URL = process.env.CALENDLY_URL || 'https://calendly.com/abualiwael/30min';
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { history = [], captured = {} } = req.body || {};

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      assistant: "I'm not fully configured yet. Please book directly: " + CALENDLY_URL,
    });
  }

  // Trim history to last 14 messages (Haiku context budget)
  const trimmed = history.slice(-14);

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: SYSTEM_PROMPT + '\n\nCONTEXT (already captured this session): ' + JSON.stringify(captured),
        messages: trimmed.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic error', anthropicRes.status, errText);
      return res.status(200).json({
        assistant: "I'm having trouble right now. Please book directly: " + CALENDLY_URL,
      });
    }

    const data = await anthropicRes.json();
    const raw = (data.content && data.content[0] && data.content[0].text) || '';

    // Try parse JSON; if model returned plain text, wrap it
    let parsed;
    try {
      // Find first { and last } — handles cases where Haiku wraps in prose
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      parsed = (start >= 0 && end > start)
        ? JSON.parse(raw.slice(start, end + 1))
        : { assistant: raw, captured: {}, quick_replies: [] };
    } catch (e) {
      parsed = { assistant: raw, captured: {}, quick_replies: [] };
    }

    // Merge newly-captured fields with the running session
    const newCaptured = { ...captured, ...(parsed.captured || {}) };

    // Push to HubSpot once we have email OR phone
    if (HUBSPOT_TOKEN && (newCaptured.email || newCaptured.phone)) {
      pushToHubSpot(newCaptured).catch(e => console.error('HubSpot push failed', e));
    }

    return res.status(200).json({
      assistant: parsed.assistant || raw || "Hmm, can you say that again?",
      captured: parsed.captured || {},
      quick_replies: parsed.quick_replies || [],
    });
  } catch (err) {
    console.error('handler error', err);
    return res.status(200).json({
      assistant: "I'm offline for a moment. Please book a call directly: " + CALENDLY_URL,
    });
  }
}

async function pushToHubSpot(captured) {
  if (!captured.email && !captured.phone) return;

  const props = {
    apex_segment:        'chatbot_inbound',
    apex_first_touch:    new Date().toISOString().slice(0, 10),
    lifecyclestage:      'lead',
    hs_lead_status:      'NEW',
  };
  if (captured.first_name)        props.firstname        = captured.first_name;
  if (captured.last_name)         props.lastname         = captured.last_name;
  if (captured.email)             props.email            = captured.email;
  if (captured.phone)             props.phone            = captured.phone;
  if (captured.loan_purpose)      props.loan_purpose     = captured.loan_purpose;
  if (typeof captured.is_self_employed === 'boolean') {
    props.apex_self_employed = captured.is_self_employed ? 'true' : 'false';
  }
  if (captured.state)             props.state            = captured.state;

  // Use email as idProperty when present, otherwise create with phone
  const lookupKey = captured.email || captured.phone;
  const idProperty = captured.email ? 'email' : 'phone';
  const url = `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(lookupKey)}?idProperty=${idProperty}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties: props }),
  });

  if (!res.ok && res.status === 404) {
    // Contact doesn't exist yet — create
    await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: props }),
    });
  }
}
