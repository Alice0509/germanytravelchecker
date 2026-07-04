# Deployment QA checklist

Use this checklist after deployment, major planner changes, navigation changes, seasonal event note updates or SEO metadata updates.

## Build and repository state

- Run `npm run build`
- Confirm `git status` is clean after commit and merge
- Do not commit `dist/` changes directly

## Navigation checks

Check these pages on desktop and mobile:

- `https://germanytravelchecker.com/`
- `https://germanytravelchecker.com/planner.html`
- `https://germanytravelchecker.com/berlin.html`
- `https://germanytravelchecker.com/munich.html`
- `https://germanytravelchecker.com/train-trouble.html`
- `https://germanytravelchecker.com/sunday-holiday-closures.html`
- `https://germanytravelchecker.com/water-pfand-guide.html`
- `https://germanytravelchecker.com/impressum.html`
- `https://germanytravelchecker.com/datenschutz.html`

Expected:

- Each page has access to the main Menu
- The Menu opens on mobile and desktop
- Menu groups are visible: Plan, City guides, Trouble guides, Site
- Menu links go to the expected pages
- Mobile floating Menu button stays usable while scrolling
- Desktop layout is not made heavier or crowded by the mobile menu behavior

## Home page checks

Open `https://germanytravelchecker.com/`.

Expected:

- Hero headline says the site helps users plan around German holidays, school breaks and travel trouble
- Check Today card appears
- Planner links are visible
- Trouble Finder appears
- Trouble guide cards link to Train trouble, Sunday closures and Water/Pfand pages
- Footer links work

## Planner core checks

Open `https://germanytravelchecker.com/planner.html`.

### Low calendar-risk result

Use:

- City: Berlin
- Start date: 2026-06-10
- End date: 2026-06-12

Expected:

- Result says there is no major calendar signal
- Low risk copy does not promise that places are open
- Live checks are still shown

### Nuremberg Christkindlesmarkt note

Use:

- City: Nuremberg
- Start date: 2026-12-01
- End date: 2026-12-03

Expected:

- Seasonal event note appears
- Event name: Christkindlesmarkt season
- Official season: 2026-11-27 – 2026-12-24
- Official Christkindlesmarkt and Nuremberg tourism links are visible

### Munich Oktoberfest notes

Use:

- City: Munich
- Start date: 2026-09-20
- End date: 2026-09-22

Expected:

- Oktoberfest season note appears
- Official season: 2026-09-19 – 2026-10-04

Use:

- City: Munich
- Start date: 2027-09-20
- End date: 2027-09-22

Expected:

- Oktoberfest season note appears
- Official season: 2027-09-18 – 2027-10-03

Use:

- City: Munich
- Start date: 2027-08-10
- End date: 2027-08-12

Expected:

- Oktoberfest note does not appear

### Berlin New Year note

Use:

- City: Berlin
- Start date: 2026-12-31
- End date: 2027-01-01

Expected:

- New Year period note appears
- Official check period is shown
- Wording stays cautious and asks the traveler to verify official city, tourism and transport sources

Use:

- City: Berlin
- Start date: 2026-12-15
- End date: 2026-12-16

Expected:

- New Year note does not appear

## Multi-city checks

Open the multi-city section on `planner.html`.

### Same-day transfer risk

Use:

- Segment 1: Berlin, 2026-06-10 to 2026-06-12
- Segment 2: Hamburg, 2026-06-12 to 2026-06-14

Expected:

- Transfer day is detected
- Overall itinerary risk is medium
- Transfer day essentials card appears

### Seasonal notes inside segments

Use:

- Segment 1: Nuremberg, 2026-12-01 to 2026-12-03
- Segment 2: Munich, 2026-12-03 to 2026-12-06

Expected:

- Nuremberg segment shows the Christkindlesmarkt seasonal event note
- Official event links appear inside the segment

## City guide prefill checks

Open:

- `https://germanytravelchecker.com/berlin.html`
- Click “Add Berlin to a multi-city trip”

Expected:

- Planner opens the multi-city section
- Segment 1 is Berlin

Open:

- `https://germanytravelchecker.com/munich.html`
- Click “Add Munich to a multi-city trip”

Expected:

- Planner opens the multi-city section
- Segment 1 is Munich

## Static guide checks

Open:

- `https://germanytravelchecker.com/train-trouble.html`
- `https://germanytravelchecker.com/sunday-holiday-closures.html`
- `https://germanytravelchecker.com/water-pfand-guide.html`

Expected:

- Related guide links are visible
- Footer links work
- Menu works
- Pages do not promise live train, shop, pharmacy or price data

## SEO checks

Open:

- `https://germanytravelchecker.com/robots.txt`
- `https://germanytravelchecker.com/sitemap.xml`

Expected:

- robots.txt loads
- sitemap.xml loads
- sitemap includes home, planner, train trouble, Berlin, Munich, Sunday closures, Water/Pfand, Impressum and Datenschutz
- sitemap does not include pages that do not exist

Check page source for:

- canonical URL
- meta description
- Open Graph title
- Open Graph description

Important pages:

- Home
- Planner
- Berlin guide
- Munich guide
- Train trouble guide
- Sunday closures guide
- Water/Pfand guide

## Search Console checks

After deployment:

- Submit or refresh the sitemap in Google Search Console after major URL or sitemap changes
- Use URL Inspection for the home page and planner page after major changes
- Check whether sitemap status becomes Success
- Check whether key pages are indexed or discovered

## Trust and safety checks

Across the site, confirm:

- The site does not claim to know live opening hours
- The site does not claim to know live train disruptions
- The site does not claim a specific pharmacy, shop, restaurant or event venue is open now
- Seasonal event notes link to official sources
- Seasonal event notes say dates, hours, access rules or transport changes can vary
- Guidance remains practical rather than alarmist
