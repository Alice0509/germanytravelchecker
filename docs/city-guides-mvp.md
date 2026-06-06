# City Guides MVP

## Purpose

City Guides are the SEO and practical guidance layer of Germany Travel Checker.

They should help English-speaking travelers understand Germany-specific travel risks for a specific city.

City Guides are not generic travel blog pages.

They should focus on practical checks related to:

- German federal state mapping
- public holidays
- Sunday closures
- school holiday travel timing
- groceries and water
- cafés and bakeries
- pharmacies and emergency pharmacy guidance
- links back to the interactive checkers

## Core user question

What should I know about closures, holidays and trip timing in this German city?

Example questions:

- Is Berlin affected by public holidays differently from Bavaria?
- Are supermarkets open on Sundays in Munich?
- Which federal state applies to Hamburg?
- Can I use the same holiday calendar for Cologne and Frankfurt?
- Will school holidays make trains, hotels or attractions busier?
- Where should I check first for groceries, water or pharmacies?

## Product role

City Guides should support three product goals:

1. Help travelers understand a city before using the checker.
2. Create indexable SEO pages for common Germany travel questions.
3. Link users back into Check Today, Check Trip Dates and Multi-city Trip.

City Guides should not replace the interactive checkers.

They should explain the city context and then guide users to check their own date.

## Initial city pages

Recommended first pages:

- Berlin
- Munich

Next candidates:

- Hamburg
- Cologne
- Frankfurt
- Stuttgart
- Dresden
- Nuremberg

Initial URL structure:

- /berlin.html
- /munich.html
- /hamburg.html
- /cologne.html
- /frankfurt.html

Keep URLs short and English.

## Page structure

Each city guide page should include:

### 1. Hero

Purpose:

- city name
- short practical promise
- federal state mapping
- primary call to action

Example:

Berlin Travel Checker

Berlin is its own German federal state. Use this guide to understand public holidays, Sunday closures, pharmacies, essentials and travel timing before checking your exact date.

CTA examples:

- Check today in Berlin
- Check Berlin trip dates
- Add Berlin to a multi-city trip

### 2. City to federal state

Explain which German federal state applies.

Example:

Berlin is both a city and a federal state. Public holidays and school holidays for Berlin follow the Berlin state calendar.

### 3. Public holidays

Explain:

- public holidays can close regular shops and supermarkets
- holidays vary by federal state
- travelers should check their exact date

Do not copy long official holiday descriptions.

Link users to Check Today or Check Trip Dates.

### 4. Sunday closures

Explain:

- many regular shops and supermarkets are usually closed on Sundays in Germany
- transport hubs, airports, gas stations, cafés, bakeries, restaurants and hotels may be fallback options
- exact opening hours still vary

### 5. Groceries and essentials

Explain practical fallback categories:

- major train stations
- airports
- gas stations
- kiosks
- cafés
- bakeries
- restaurants
- hotel reception

Avoid exact opening-hour claims.

### 6. Pharmacy and emergency help

Explain carefully:

- regular pharmacies may be closed on Sundays and public holidays
- emergency pharmacies change by date and location
- travelers should check official Notdienst-Apotheke services, Google Maps or pharmacy websites
- call 112 in a medical emergency
- call 110 for police emergencies
- use 116117 for non-emergency medical on-call help outside regular office hours

Do not provide medical diagnosis, triage or treatment advice.

### 7. School holiday travel timing

Explain:

- school holidays do not usually close shops
- trains, roads, hotels and attractions may be busier
- the effect depends on date, city and surrounding states

Link to Check Trip Dates.

### 8. Multi-city notes

Explain:

- many travelers combine this city with another German city
- city-to-state differences can matter
- transfer days may be affected by both departure and arrival city conditions

Example links:

- Berlin to Munich
- Munich to Berlin
- Frankfurt to Cologne
- Berlin to Dresden

Do not optimize routes or predict train delays.

### 9. Data and disclaimer

Include:

- data by Schulferienklar
- rule-based guidance
- exact opening hours can change
- verify critical plans with official sources, Google Maps or business websites

## Content boundaries

City Guides may include:

- city to state mapping
- public holiday explanation
- Sunday closure explanation
- school holiday travel timing
- practical fallback categories
- pharmacy safety guidance
- links to interactive checkers

City Guides must not include:

- exact shop opening hours
- exact emergency pharmacy schedules
- restaurant recommendations
- hotel price predictions
- train price predictions
- live transport disruption data
- medical diagnosis or treatment advice
- AI-generated city content at scale
- copied official content

## SEO direction

Each page should target practical search intent.

Good search intent examples:

- Berlin public holidays for travelers
- are shops open in Berlin on Sunday
- Munich public holiday shops closed
- Germany Sunday closures tourists
- Berlin pharmacy Sunday traveler
- Munich school holidays travel timing

Avoid generic travel blog intent:

- best things to do in Berlin
- top 10 restaurants in Munich
- Berlin itinerary 3 days
- where to stay in Hamburg

## Internal linking

Each City Guide should link to:

- homepage
- Check Today section
- Check Trip Dates section
- Multi-city Trip section
- Schulferienklar as data source
- Impressum
- Datenschutz

Future city pages should link to each other only when useful.

Examples:

- Berlin guide can mention Munich for multi-city travel.
- Munich guide can mention Nuremberg and Berlin.
- Cologne guide can mention Frankfurt and Hamburg.

## MVP implementation approach

First implementation should be simple static pages.

Recommended first pages:

- public/berlin.html
- public/munich.html

Reasons:

- easy to index
- independent of React routing
- works on GitHub Pages
- easy to add to sitemap
- no SPA routing complexity

Later, city pages can be moved into React routing if needed.

## Design direction

City pages should visually match the main site:

- bright cream background
- teal accents
- navy text
- subtle German flag accent only where useful
- compact cards
- mobile-first layout
- clear CTAs

They should feel like practical checker pages, not long articles.

## First implementation goal

The first City Guides implementation should add Berlin and Munich only.

It should include:

- two static HTML pages
- sitemap updates
- homepage City Guides preview links
- footer remains unchanged
- no AI
- no affiliate links
- no exact opening-hour database

## Future extensions

Possible later additions:

- Hamburg guide
- Cologne guide
- Frankfurt guide
- Stuttgart guide
- Dresden guide
- Nuremberg guide
- city-specific FAQ sections
- structured data if appropriate
- saved or shareable city checks
- affiliate experiments after trust is established
