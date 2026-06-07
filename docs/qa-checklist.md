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
- Trouble Finder input and chips fit inside the viewport width
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
- planner footer

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
- Trouble Finder card is readable and not visually overwhelming
- planner footer matches the rest of the visual system
- planner action buttons keep the homepage-style visual treatment
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
- planner.html has a title
- planner.html has a meta description
- train-trouble.html has a title
- train-trouble.html has a meta description
- Berlin and Munich guide pages have city-specific titles
- Berlin and Munich guide pages have city-specific meta descriptions
- canonical URL points to https://germanytravelchecker.com/
- planner canonical URL points to https://germanytravelchecker.com/planner.html
- city guide canonical URLs point to their public URLs
- Open Graph title exists
- Open Graph description exists
- Open Graph image exists
- Twitter card metadata exists
- homepage and planner metadata match the travel trouble checker positioning
- city guide metadata mentions practical trouble topics such as Sunday closures, water, pharmacies, Pfand or cash
- train trouble metadata mentions German train disruption words such as SEV, Gleisänderung, fällt aus or Bauarbeiten
- robots.txt points to sitemap.xml
- sitemap.xml includes https://germanytravelchecker.com/
- sitemap.xml includes https://germanytravelchecker.com/train-trouble.html


## Trouble Finder functional checks

Use the homepage Trouble Finder.

Check:

- search input accepts typing
- example chips update the result
- water returns still/sparkling water and Pfand guidance
- Sunday returns supermarket closure guidance
- pharmacy returns safe emergency wording
- cash or toilet returns coins/payment backup guidance
- airport returns late or early arrival guidance
- unknown input falls back to a useful general trouble tip
- the component does not claim exact opening hours or live availability

Suggested manual cases:

- water
- Sunday
- pharmacy
- cash
- toilet
- Pfand
- airport
- random unknown text

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
- Water quick help appears when Water is selected
- Before shops close checklist appears on Sundays or public holidays
- Google Maps live check links open in a new tab
- live check links are city-specific
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
- Before shops close warning appears when range includes Sunday or public holiday
- city-specific live check links appear in the Trip Dates result
- live check links open in a new tab

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
- transfer essentials warning appears only for non-low-risk itineraries
- low-risk transfer itineraries do not show unnecessary essentials warnings
- per-city warnings are visible
- risky city segments show compact live check links
- low-risk city segments do not show extra live check links
- mobile date inputs stay inside the card

Suggested manual cases:

- Munich to Berlin with same transfer date
- Frankfurt to Cologne to Hamburg
- Berlin to Dresden to Munich
- segment with Sunday
- segment with public holiday
- segment with school holiday overlap




## Train Trouble Guide checks

Check `/train-trouble.html`.

Check:

- page returns 200 locally and in production
- homepage links to the Train Trouble Guide
- guide explains `Gleisänderung` as a platform change
- guide explains `fällt aus` as a cancelled train
- guide explains `SEV` or `Schienenersatzverkehr` as replacement bus
- guide explains `Bauarbeiten` as construction works
- guide tells users to verify with DB Navigator, local transport apps, station displays or staff
- guide does not claim live train disruption data
- guide is readable on mobile when the traveler may have luggage or children

Suggested manual cases:

- open `/train-trouble.html`
- click homepage Train Trouble Guide link
- search page text for `Gleisänderung`
- search page text for `SEV`
- search page text for `Bauarbeiten`

## Planner link and anchor checks

Check:

- homepage one-city CTA opens `/planner.html#trip-dates`
- homepage multi-city CTA opens `/planner.html#multi-city-trip`
- planner hash links scroll to the intended section after React renders
- `/planner.html#trip-dates` lands near Check Trip Dates
- `/planner.html#multi-city-trip` lands near Multi-city Trip
- city guide trip-date buttons point to `/planner.html#trip-dates`
- city guide multi-city buttons point to `/planner.html#multi-city-trip`
- planner action buttons do not look like weak underlined text links

## City guide trouble checks

Check Berlin and Munich guide pages.

Check:

- hero copy matches the travel trouble checker positioning
- Small Germany troubles card is visible
- Pfand, cash or coins, paid toilets and water label notes are visible
- live check links for supermarkets, cafés or bakeries and pharmacies are city-specific
- live check links open in a new tab
- planner CTA appears before the note and footer
- footer links remain readable and visually consistent

Suggested manual cases:

- Berlin guide
- Munich guide
- click each live check link once
- verify planner CTA opens /planner.html
- verify city guide trip-date CTAs open /planner.html#trip-dates
- verify city guide multi-city CTAs open /planner.html#multi-city-trip

## Trouble checker positioning checks

Check:

- homepage hero mentions small Germany travel trouble
- planner hero mentions closure risks, transfer planning and essentials problems
- planner FAQ uses trouble-focused wording without sounding alarmist
- copy includes human, real-traveler moments such as arriving tired, landing late, carrying luggage or needing water on a Sunday
- copy sounds calm, practical and specific rather than generic or AI-like
- city guides focus on practical trouble, not generic sightseeing
- copy does not promise exact opening hours or live availability
- copy does not imply every station, kiosk, toilet or vending machine is available

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
