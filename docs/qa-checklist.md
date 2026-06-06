# Germany Travel Checker QA Checklist

This checklist should be used before and after important changes to Germany Travel Checker.

It is especially useful before merging UI, data, SEO, branding or deployment changes.

## Deployment checks

Check the production domain:

    curl -I https://germanytravelchecker.com

Expected:

- HTTP status is 200
- HTTPS works
- no certificate warning
- www redirects to the apex domain

Check www redirect:

    curl -I https://www.germanytravelchecker.com

Expected:

- HTTP status is 301 or 308
- location points to https://germanytravelchecker.com/

Check deployed metadata files:

    curl -I https://germanytravelchecker.com/robots.txt
    curl -I https://germanytravelchecker.com/sitemap.xml
    curl -I https://germanytravelchecker.com/manifest.webmanifest
    curl -I https://germanytravelchecker.com/favicon.svg
    curl -I https://germanytravelchecker.com/og-image.png

Expected:

- all return 200
- favicon and OG image are available

## Build checks

Before opening a PR, run:

    npm run build

Expected:

- build succeeds
- no syntax errors
- no missing imports
- no broken asset paths

## Mobile layout checks

Test on an iPhone-sized viewport or real iPhone.

Check:

- no horizontal scrolling
- hero text does not feel too cramped
- CTA buttons fit inside the screen
- Check Today card fits inside the viewport width
- date inputs do not overflow
- Trip Dates controls do not overflow
- Multi-city segment controls do not overflow
- lower sections do not feel excessively long
- footer is readable
- favicon looks transparent in the browser tab

Important mobile sections:

- hero
- Check Today
- Three ways to use it
- Check Trip Dates
- Multi-city Trip
- City Guides preview
- Safety section
- footer

## Desktop layout checks

Test on a desktop browser.

Check:

- hero grid looks balanced
- Check Today card does not look too narrow
- three mode cards align correctly
- feature cards align correctly
- Trip Dates section has clear controls
- Multi-city Trip section is readable
- City Guides preview is compact
- no section feels visually broken at wider widths

## Brand asset checks

Check:

- favicon is transparent and not shown as a full square block
- apple touch icon is present
- manifest icons are present
- OG image is present
- theme color matches the brighter brand direction
- German flag accent is subtle and not visually heavy

Important files:

- public/favicon.svg
- public/favicon-48x48.png
- public/apple-touch-icon.png
- public/icon-192.png
- public/icon-512.png
- public/icon-1024.png
- public/og-image.png
- public/manifest.webmanifest

## SEO checks

Check:

- index.html has a title
- index.html has a meta description
- canonical URL points to https://germanytravelchecker.com/
- Open Graph title exists
- Open Graph description exists
- Open Graph image exists
- Twitter card metadata exists
- robots.txt points to sitemap.xml
- sitemap.xml includes https://germanytravelchecker.com/

## Check Today functional checks

Use Check Today with several cities.

Check:

- city selector works
- date selector works
- need buttons toggle correctly
- risk badge updates
- federal state changes with city
- Sunday status is shown correctly
- public holiday status is shown when data matches
- school holiday status is shown when data matches
- pharmacy guidance includes safe emergency wording
- disclaimer is visible

Suggested manual cases:

- Berlin today
- Munich on a Sunday
- Cologne with pharmacy selected
- Frankfurt with groceries selected

## Check Trip Dates functional checks

Use Check Trip Dates with one city and a date range.

Check:

- city selector works
- start date works
- end date works
- reversed date ranges do not break the result
- Sunday warnings appear when range includes Sunday
- public holiday warnings appear when range includes a public holiday
- school holiday overlap appears when range overlaps school holidays
- risk level is low, medium or high
- result summary is readable on mobile
- date inputs stay inside the card

Suggested manual cases:

- Berlin, normal weekday range
- Munich, range including a Sunday
- Bavaria, range including a known public holiday
- Hamburg, range overlapping school holidays

## Multi-city Trip functional checks

Use Multi-city Trip with at least two city segments.

Check:

- default Munich to Berlin segments load
- city selectors work per segment
- start and end dates work per segment
- Add another city works
- Remove appears only when more than two segments exist
- maximum segment limit works
- overall risk appears
- segment risk appears
- transfer day is detected when one segment end date equals the next segment start date
- transfer day note is shown
- per-city warnings are visible
- mobile date inputs stay inside the card

Suggested manual cases:

- Munich to Berlin with same transfer date
- Frankfurt to Cologne to Hamburg
- Berlin to Dresden to Munich
- segment with Sunday
- segment with public holiday
- segment with school holiday overlap

## Safety and trust checks

Check that the product does not claim:

- exact shop opening hours
- exact pharmacy duty schedules
- exact emergency room availability
- medical diagnosis
- treatment advice
- train delay predictions
- hotel price predictions
- guaranteed availability

Emergency wording should remain careful:

- 112 for medical emergencies
- 110 for police emergencies
- 116117 for non-emergency medical on-call help
- official Notdienst-Apotheke services for emergency pharmacies

## Data boundary checks

Check that the app still uses:

- Schulferienklar public holiday data
- Schulferienklar school holiday data
- city to German federal state mapping
- rule-based guidance

Check that the app does not maintain unstable live datasets directly in the MVP.

## Copy checks

Check:

- Check Today is clearly for now or same-day use
- Check Trip Dates is clearly for one-city planning
- Multi-city Trip is clearly for multiple city segments
- City Guides preview is compact
- Safety copy is short but clear
- Data by Schulferienklar remains visible
- no page section feels overly repetitive

## PR review checks

Before merging a PR:

- read the diff
- run npm run build
- confirm no accidental large assets were added
- confirm no generated dist folder is committed
- confirm no private keys or tokens are present
- confirm PR title matches the change
- confirm PR body explains what changed
