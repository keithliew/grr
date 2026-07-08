# Lexis Hibiscus 2 Landing Pages — Deployment Notes

## Files (all self-contained — do NOT link the main site's CSS/JS)
| File | Purpose |
|---|---|
| `rental-programme.html` | Variant A — investment-intent ad group lands here |
| `villas.html` | Variant B — lifestyle-intent ad group lands here |
| `thank-you.html` | Form-submission destination = clean Google Ads conversion trigger |
| `lp.css` | Shared stylesheet (both variants + thank-you) |
| `lp.js` | Shared JS: WhatsApp links, tracking events, FAQ, sticky bar |

## Recommended install
Upload the whole folder as `/lp/` on grrmalaysia.com:
- `https://grrmalaysia.com/lp/rental-programme.html`
- `https://grrmalaysia.com/lp/villas.html`
- `https://grrmalaysia.com/lp/thank-you.html`

Keeping them in `/lp/` means zero contact with the existing site's files. Do not add
these pages to the main site navigation, and keep the `noindex` meta during the test.

## Replace before launch (search each file for these)
1. `[WHATSAPP_NUMBER]` — in `lp.js`, ONE place. Format: `60123456789` (country code, no + / spaces).
2. `[WEB3FORM_ACCESS_KEY]` — in both HTML forms. Get free key at web3forms.com.
3. Form `redirect` hidden field — confirm it matches your live thank-you URL exactly.
4. `[GTM_ID]` — uncomment the GTM snippets (head + noscript) in all three pages.
5. `[INSERT ...]` items — villa sizes, prices, foreign-ownership text, APDL/permit number.
6. `<!-- [VERIFY ...] -->` comments — occupancy stats approval, testimonial permission, Phase 1 % sold.
7. Replace `.img-ph` placeholder divs with real `<img loading="lazy" alt="...">` renders,
   keeping the "artist impression" notes.

## Tracking setup (GTM)
- `whatsapp_click` → PRIMARY Google Ads conversion
- `lead_form_submit` → fires automatically on thank-you.html (secondary conversion)
- `programme_details_request` → engagement signal only
- Every event includes `lp_variant: "A" | "B"` — use it to compare pages in GA4.

## Ads mapping (from the v2 content plan)
- Ad Group 1 (rental/leaseback keywords, RM600) → final URL = /lp/rental-programme.html
- Ad Group 2 (villa/lifestyle keywords, RM400) → final URL = /lp/villas.html
- Add UTM per ad group, e.g. `?utm_source=google&utm_medium=cpc&utm_campaign=lh2_test&utm_content=groupA`

## Pre-launch QA checklist
- [ ] Both forms submit and land on thank-you.html
- [ ] WhatsApp buttons open with the correct pre-filled message (different per variant)
- [ ] GTM preview shows whatsapp_click and lead_form_submit firing with lp_variant
- [ ] All [INSERT]/[VERIFY] items resolved + compliance sign-off on both pages
- [ ] Mobile check: sticky bar appears after hero, form usable, no horizontal scroll
- [ ] Banned-terms scan (per plan): no "guaranteed", "cashback", "zero downpayment",
      "passive income", "risk-free" anywhere; % figures ONLY in Variant A programme section
