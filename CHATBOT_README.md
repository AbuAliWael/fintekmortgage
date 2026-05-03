# Fintek Mortgage AI Chatbot

NJ-licensed Non-QM specialist chatbot for fintekmortgage.com. Captures self-employed borrower contact info, books Calendly slots, upserts to HubSpot.

## Architecture

```
fintekmortgage.com (Vercel)
    └── /chat                  →  widget.html  (frontend, static)
    └── /api/chat              →  api/chat.js  (serverless, Node 18+)
        └── Anthropic Claude Haiku (LLM backend)
        └── HubSpot CRM (lead capture)
```

## Deploy to Vercel (existing fintekmortgage repo)

1. Copy `widget.html` to `public/chat.html` in the fintekmortgage GitHub repo
2. Copy `api/chat.js` to `api/chat.js` in the same repo
3. Add Vercel environment variables:
   - `ANTHROPIC_API_KEY` — from console.anthropic.com (uses `claude-haiku-4-5-20251001`)
   - `HUBSPOT_TOKEN` — already in your stack (`pat-na2-...`)
   - `CALENDLY_URL` — `https://calendly.com/abualiwael/30min` (default if unset)
4. Push to main → Vercel auto-deploys
5. Test live at `https://fintekmortgage.com/chat.html`

## Embed on every page

Add this to `index.html` (or whichever pages should show the chat):

```html
<a href="/chat.html" class="chat-launcher">
  Self-Employed Mortgage AI · Free 30-second pre-qual
</a>
```

Or for a floating widget, use an iframe:

```html
<iframe src="/chat.html"
        style="position:fixed;bottom:20px;right:20px;width:380px;height:600px;
               border:1px solid #E5E5E5;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
</iframe>
```

## Cost

- **Haiku**: ~$0.25 per 1M input tokens, $1.25 per 1M output tokens
- **Per conversation**: ~3-8K tokens total = $0.005–$0.015
- **At 100 conversations/month**: ~$0.50–$1.50
- **At 1,000 conversations/month**: ~$5–$15
- Well within the $5/mo Anthropic API budget already allocated.

## Compliance baked in

The system prompt enforces:
- NJ-only mandate (out-of-state users are politely redirected)
- NMLS #2171794 disclosed in any rate-quoting response
- TILA disclosure on illustrative rates
- No guaranteed-approval language
- No comparative attacks on other lenders
- Fair Housing Act compliance

If the LLM ever drifts and tries to violate, the conversation logs are reviewable in HubSpot under each lead's record.

## HubSpot integration

When the chatbot captures email OR phone, it auto-upserts the contact with:
- `apex_segment = "chatbot_inbound"`
- `lifecyclestage = "lead"`
- `hs_lead_status = "NEW"`
- `apex_first_touch = today's date`
- `apex_self_employed = "true" / "false"` (custom property — create in HubSpot first)
- `loan_purpose`, `state`, `firstname`, `email`, `phone` (standard properties)

Kate's daily brief picks these up under "📥 NEW LEADS LAST 24H" with their `apex_segment` tag.

## Testing locally

```
npm install -g vercel
cd fintekmortgage_chatbot
vercel dev
# Then open http://localhost:3000/widget.html
```

## What it WON'T do

- Run a real underwriting decision (it's an indicative-only educational tool)
- Quote specific live rates without the TILA disclaimer
- Engage with non-NJ prospects past the initial state-check
- Replace Wael's licensed activity (NMLS-mandated work stays with Wael)
