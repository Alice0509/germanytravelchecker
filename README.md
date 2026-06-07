# Germany Travel Checker

Germany Travel Checker is an English-language travel trouble checker for visitors to Germany.

It helps travelers avoid practical Germany-specific travel trouble around:

- public holidays
- Sunday closures
- school holiday travel periods
- groceries and water
- cafés and bakeries
- pharmacies and emergency pharmacy guidance
- one-city trip dates
- multi-city Germany itineraries

Live site:

https://germanytravelchecker.com

## Product direction

Germany Travel Checker is not a generic travel blog.

It is a practical checker for travelers who want to avoid small Germany travel troubles before they become expensive or stressful.

The product is designed for English-speaking visitors, especially travelers from:

- the United States
- Canada
- Australia
- the United Kingdom
- other English-speaking countries

Many international travelers know they are visiting Berlin, Munich or Hamburg, but do not know which German federal state controls the holiday calendar, why supermarkets close on Sundays, what Pfand means, or why water, toilets, pharmacies and transfer days may need extra planning.

## Relationship to Schulferienklar

Germany Travel Checker is a separate English travel product.

It uses public holiday and school holiday data from Schulferienklar:

https://www.schulferienklar.de

Schulferienklar remains the German-first calendar project for school holidays and public holidays.

Germany Travel Checker has its own:

- domain
- repository
- design direction
- English-first user experience
- travel-focused product strategy

## Current features

### Check Today

For travelers who are already in Germany or need a quick same-day check.

Check Today helps users check:

- selected city
- selected date
- German federal state
- Sunday status
- public holiday status
- school holiday period status
- practical fallback guidance for essentials, water, cash and everyday trouble

Example question:

I am in Berlin today. Are regular shops likely to be closed?

### Check Trip Dates

For travelers planning one city before booking hotels, trains or activities.

Check Trip Dates helps users check:

- one city
- one date range
- Sundays in the date range
- public holiday overlaps
- school holiday overlaps
- simple risk level
- practical planning warnings

Example question:

I will be in Munich from June 5 to June 9. Do my dates need extra planning?

### Multi-city Trip

For travelers visiting more than one German city.

Multi-city Trip helps users check multiple city segments, such as:

- Munich → Berlin
- Frankfurt → Cologne → Hamburg
- Berlin → Dresden → Munich

It shows:

- overall itinerary risk
- per-city segment checks
- transfer day notes
- public holiday warnings
- Sunday warnings
- school holiday overlap warnings

Example question:

I will be in Munich, then Berlin, then Hamburg. Which part of my trip needs planning?

### City Guides preview

The site includes a compact City Guides preview.

City guide content should stay focused on practical Germany-specific trouble checks, not generic sightseeing advice.

Potential city guide topics:

- federal state mapping
- public holiday rules
- Sunday closure patterns
- essentials, water, Pfand, cash and fallback categories
- pharmacy guidance
- school holiday travel timing

## What this app does not do

Germany Travel Checker does not provide:

- exact shop opening hours
- live business availability
- hotel price predictions
- train price predictions
- real-time transport disruption data
- exact emergency pharmacy duty schedules
- tobacco vending machine locations
- medical diagnosis or treatment advice
- AI-generated emergency decisions

The app provides conservative, rule-based guidance and points travelers toward official sources, Google Maps or business websites for time-sensitive details.

## Safety principles

The product must be careful with medical and emergency information.

Allowed guidance includes:

- call 112 for medical emergencies or life-threatening situations
- call 110 for police emergencies
- use 116117 for non-emergency medical on-call help outside regular office hours
- check official Notdienst-Apotheke services for emergency pharmacies
- verify pharmacy and business opening hours before going

Germany Travel Checker must not diagnose, triage symptoms or recommend avoiding medical care.

## Data principles

Germany Travel Checker may use:

- Schulferienklar school holiday data
- Schulferienklar public holiday data
- city to German federal state mapping
- date and weekday calculations
- rule-based closure guidance
- conservative fallback categories

The app should avoid maintaining unstable real-time datasets unless a reliable official or commercial source is integrated later.

## Tech stack

- React
- Vite
- JavaScript
- GitHub Pages
- Custom domain: germanytravelchecker.com

## Development

Install dependencies:

    npm install

Run local development server:

    npm run dev

Build production assets:

    npm run build

Preview production build:

    npm run preview

## Deployment

The app is deployed with GitHub Pages.

Production domain:

https://germanytravelchecker.com

## Product notes

The first product layer is rule-based.

AI may be considered later only as an explanation layer after the rule-based checker is useful and reliable.

Future roadmap ideas include:

- stronger city guide pages
- saved or shareable trip checks
- route timeline views
- multi-country trip warnings
- affiliate experiments for travel planning
- cautious AI explanations based on rule-based results
