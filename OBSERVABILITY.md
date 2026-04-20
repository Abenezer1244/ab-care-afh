# Observability setup

Three things to turn on once the site is live. All require external accounts.

## 1. Privacy-friendly analytics

Recommended: [Plausible](https://plausible.io) or [Fathom](https://usefathom.com). No cookie banner required (GDPR/PECR friendly).

After creating an account for `abcareafhllc.com`, paste the tag into every page before `</head>`. Example for Plausible:

```html
<script defer data-domain="abcareafhllc.com" src="https://plausible.io/js/script.js"></script>
```

Run this Python one-liner to apply to all pages at once:

```bash
python scripts/add_snippet.py  # TODO: write once you have the snippet
```

What to watch:
- Top pages (expect Home, Contact, Services)
- Referrers (Google local pack, Bing, direct)
- Top outbound events if you later add them (phone click, form submit)

## 2. Form submission tracking

FormSubmit.co already emails you each submission. To also track in analytics, add a redirect to a unique success URL + fire a custom event on `thanks.html`:

```html
<!-- on thanks.html, after load -->
<script>plausible('FormSubmit', {props: {source: 'contact'}});</script>
```

Decide what to do with spam: FormSubmit has reCAPTCHA on by default. We disabled it (`_captcha=false`) to keep the form snappy. If you start getting spam, flip it back on:

```html
<input type="hidden" name="_captcha" value="true">
```

The honeypot (`_honey`) is already wired.

## 3. Uptime monitoring

[UptimeRobot](https://uptimerobot.com) free tier pings the site every 5 minutes. Set up:
- Monitor: `https://abcareafhllc.com/` (HTTP keyword contains "AB CARE")
- Alert contact: your email + SMS
- Keyword: "AB CARE" catches both 5xx errors AND accidental blank pages (common after a bad deploy)

Optional second monitor on `https://abcareafhllc.com/contact.html` to catch form page regressions specifically.

## When to care

- **Week 1 after launch:** daily glance at analytics + inbox to confirm form works
- **Month 1:** check which pages bring inquiries, where referrers come from
- **Ongoing:** uptime alerts are the only thing that should interrupt you
