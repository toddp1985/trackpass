# Meta Ad Test — Austin, $100 (approved by Todd 2026-07-01)

Ready to launch. Needs from Todd: Meta Ads Manager access (or he creates the campaign from this spec), and ideally a Meta Pixel ID to install before launch (5-min site change — tell Claude the ID).

## Campaign
- **Objective:** Traffic → Landing Page Views (no pixel history yet; switch to Sales objective on a second test once the pixel has purchase data)
- **Budget:** $10/day × 10 days = $100 total. Hard stop.
- **Schedule:** start any day; runs Thu–Sun heavier if using ad scheduling (golfers plan weekends)

## Ad set
- **Geo:** Austin, TX +25 miles
- **Age:** 24–60, all genders
- **Interests:** Golf, GolfNow, Topgolf, PGA Tour, public golf courses (Advantage detailed targeting ON)
- **Placements:** Facebook Feed, Instagram Feed, Instagram Reels only (exclude Audience Network + right column)

## Landing page
`https://trackpassgolf.com/plans.html?utm_source=facebook&utm_medium=paid&utm_campaign=austin-test-2026-07&utm_content=<AD_NAME>`

PostHog picks up UTMs automatically; `purchase` event fires when a buyer lands on the dashboard after Stripe checkout (shipped 2026-07-01).

## Creatives (3 variants, images from assets/courses/)
1. **price-math** — image: Lions Municipal (assets/courses/c1.jpg)
   - Primary text: "Austin munis run $35–50 a round. TrackPass is $199/year — and pays you back up to $199/year in green fees. One reimbursed round a month, anywhere public in Texas."
   - Headline: "The Texas golf pass that pays you back"
   - CTA: Learn More
2. **founding-rate** — image: hero sunset (assets/img/img_0063edc7625f.jpg)
   - Primary text: "Founding-member pricing: $199/year, locked before the public launch at $279. Free rounds at partner courses + green-fee reimbursements everywhere else in Texas. 30-day money-back guarantee."
   - Headline: "TrackPass founding rate — $199/year"
   - CTA: Sign Up
3. **local-proof** — image: Memorial Park or Brackenridge (assets/courses/c16.jpg / c7.jpg)
   - Primary text: "One pass. 95 Texas public courses. Play Lions, Riverside, Morris Williams — send the receipt, get up to $50 back per round. $16.58/month billed annually."
   - Headline: "Play more Austin golf for less"
   - CTA: Learn More

## Kill / scale criteria
- At $50 spend: kill any ad with CPC > $1.50 or zero guide-leads/purchases attributed.
- Success bar: 1 purchase (CAC ≤ $100 vs $199 LTV) OR cost-per-guide-lead < $5 → fund a $150 round 2 on the winning creative with Sales objective.
- All reads from PostHog (utm_campaign = austin-test-2026-07) + Stripe, not Meta's claimed conversions.
