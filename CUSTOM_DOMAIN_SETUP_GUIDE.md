# Custom Domain Setup Guide for Wael Abdeldayem Mortgage Website

## Overview
This guide will help you move your mortgage broker website from the preview URL to your own custom domain (e.g., waelabdeldayem.com).

---

## 🎯 Quick Summary

**Current URL:** https://fastloanhelp.preview.emergentagent.com
**Target URL:** Your custom domain (e.g., waelabdeldayem.com)

**Total Time:** 30-60 minutes
**Cost:** $10-15/year for domain + 50 credits/month for deployment

---

## Step 1: Purchase Your Domain 🌐

### Recommended Domain Names:
- waelabdeldayem.com
- waelmortgage.com
- abdeldayemmortgage.com

### Where to Buy:
1. **Namecheap** (Recommended - Easy to use, affordable)
2. **GoDaddy** (Popular, good support)
3. **Cloudflare** (Best for speed, includes free SSL)
4. **Google Domains** (Simple interface)

**Cost:** $10-15 per year

---

## Step 2: Deploy Your Application on Emergent 🚀

Before connecting a custom domain, your app must be deployed:

1. **In Emergent Dashboard:**
   - Click the **"Preview"** button first to test
   - Once satisfied, click **"Deploy"** button
   - Wait 10 minutes for deployment to complete
   - You'll get a live deployment URL

2. **Cost:** 50 credits per month per deployed app

---

## Step 3: Link Your Domain in Emergent 🔗

1. Go to your **Deployments section** in Emergent
2. Find **"Custom Domain"** section
3. Click **"Link Domain"** button
4. Enter your domain name (e.g., waelabdeldayem.com)
5. Click **"Next"**

**Emergent will provide you with:**
- An IP address (e.g., 34.57.15.54)
- DNS configuration instructions

**Write down this IP address - you'll need it in Step 4!**

---

## Step 4: Configure DNS Records ⚙️

Go to your domain registrar's website and add the DNS record:

### If You Bought from Namecheap:
1. Log into Namecheap.com
2. Click **"Domain List"**
3. Click **"Manage"** next to your domain
4. Go to **"Advanced DNS"** tab
5. Click **"Add New Record"**
6. Fill in:
   - **Type:** A Record
   - **Host:** @ (for root domain) or www
   - **Value:** [IP address from Emergent]
   - **TTL:** Automatic
7. Click **Save** (checkmark icon)

### If You Bought from GoDaddy:
1. Log into GoDaddy.com
2. Go to **"My Products" → "DNS"**
3. Find your domain, click **"Manage"**
4. Click **"Add"** in Records section
5. Fill in:
   - **Type:** A
   - **Name:** @ (for root domain)
   - **Value:** [IP address from Emergent]
   - **TTL:** 1 Hour
6. Click **"Save"**

### If You Bought from Cloudflare:
1. Log into Cloudflare.com
2. Select your domain
3. Go to **"DNS" → "Records"**
4. Click **"Add record"**
5. Fill in:
   - **Type:** A
   - **Name:** @ (for root domain)
   - **IPv4 address:** [IP address from Emergent]
   - **Proxy status:** DNS only (gray cloud, not orange)
   - **TTL:** Auto
6. Click **"Save"**

---

## Step 5: Verify Your Domain ✅

1. Return to Emergent dashboard
2. Click **"Check Status"** button
3. Wait 5-15 minutes for DNS to propagate
4. Once verified, you'll see a green **"Verified"** status
5. Your website is now live on your custom domain!

---

## Step 6: Update Your Marketing Materials 📢

Once verified, update:
- ✅ Business cards with new domain
- ✅ Email signature
- ✅ Social media profiles
- ✅ NMLS profile
- ✅ Calendly booking link description
- ✅ Mortgage application form (if possible)

---

## ⏱️ Timeline

| Step | Time Required |
|------|--------------|
| Domain Purchase | 5-10 minutes |
| Emergent Deployment | 10 minutes |
| DNS Configuration | 5-10 minutes |
| DNS Propagation | 5-15 minutes (up to 24 hours globally) |
| Verification | 5 minutes |
| **Total** | **30-60 minutes** |

---

## 💰 Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Domain Registration | $10-15 | Per year |
| Emergent Deployment | 50 credits | Per month |
| **Total Year 1** | ~$10-15 + deployment credits | |

---

## 🔍 How to Check if DNS is Working

Use these free online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

Enter your domain and select "A" record type to see if the IP address has propagated globally.

---

## ⚠️ Important Notes

1. **Only ONE A record** should point to @ (root domain)
2. **Remove any conflicting records** before adding Emergent's record
3. **Wait 5-15 minutes** after DNS changes before checking status
4. **DNS propagation** can take up to 24 hours globally (usually faster)
5. **SSL certificate** is automatically provided by Emergent (free HTTPS)

---

## 🆘 Troubleshooting

### Problem: Domain verification fails
**Solution:**
- Double-check the IP address matches exactly
- Make sure only ONE A record points to @
- Wait another 10 minutes and try again
- Use DNSChecker.org to verify the record exists

### Problem: Website shows "Site Not Found"
**Solution:**
- Verify DNS record is correct
- Check deployment status in Emergent
- Wait for global DNS propagation (up to 24 hours)

### Problem: Need help
**Contact Emergent Support:**
- Discord: https://discord.gg/VzKfwCXC4A
- Email: support@emergent.sh

---

## ✅ Final Checklist

Before starting:
- [ ] Choose your domain name
- [ ] Have payment method ready
- [ ] Ensure website is deployed in Emergent

After setup:
- [ ] Domain purchased
- [ ] DNS A record added
- [ ] Domain verified in Emergent
- [ ] Website accessible via custom domain
- [ ] Updated marketing materials

---

## 🎉 Success!

Once completed, your mortgage broker website will be live at your professional custom domain (e.g., waelabdeldayem.com) while maintaining all current features:

✅ AI qualification forms
✅ Daily mortgage insights
✅ Lead generation features
✅ NMLS compliance
✅ All loan program pages

Your preview URL will still work, but you can promote your custom domain as your primary web address!
