# City Guides MVP

## Purpose

City Guides are SEO-focused and user-friendly entry pages for Germany Travel Checker.

They should help English-speaking travelers understand practical Germany-specific rules for a specific city, especially around public holidays, Sunday closures, school holiday travel periods, groceries, pharmacies and fallback options.

City Guides are not general travel guides.

They should not compete with broad travel blogs about attractions, restaurants or sightseeing.

Their purpose is to answer practical trip-risk questions.

## Core user question

What should I know about closures, holidays and practical travel timing in this German city?

Examples:

- Are shops closed on Sundays in Berlin?
- What public holiday rules apply in Munich?
- Is Cologne affected by North Rhine-Westphalia holidays?
- What should I check before visiting Hamburg during school holidays?
- Where should travelers usually look first for essentials on Sundays?

## Initial city pages

Initial candidates:

- Berlin
- Munich
- Hamburg
- Cologne
- Frankfurt
- Stuttgart
- Dresden
- Nuremberg

These should match the initial city mapping in the product.

## Page structure

Each city guide should include:

1. City overview
2. Federal state mapping
3. Public holiday explanation
4. Sunday closure explanation
5. School holiday travel impact
6. Essentials and fallback categories
7. Pharmacy and emergency pharmacy guidance
8. Links to Check Today
9. Links to Check Trip Dates
10. Links to Multi-city Trip
11. Disclaimer

## City overview

The overview should be short and practical.

Example:

Berlin is both a city and a German federal state. Germany Travel Checker uses the Berlin holiday calendar when checking public holidays, school holiday periods and Sunday closure patterns for Berlin trips.

## Federal state mapping

Every city guide should clearly explain which federal state applies.

Examples:

- Berlin uses the Berlin state calendar.
- Munich uses the Bavaria calendar.
- Cologne uses the North Rhine-Westphalia calendar.
- Frankfurt uses the Hesse calendar.
- Dresden uses the Saxony calendar.

This is important because many international travelers know the city but not the German federal state.

## Public holidays

Each city guide should explain that public holiday rules can differ by federal state.

The guide should not list every public holiday manually unless the data is generated from Schulferienklar.

The preferred approach:

- explain the rule
- link users to Check Today and Check Trip Dates
- let the checker calculate the date-specific result

## Sunday closures

Each guide should include a short Sunday closure explanation.

Suggested copy:

In Germany, many regular shops and supermarkets are usually closed on Sundays. Travelers often check major train stations, airports, gas stations, cafés, bakeries, restaurants, kiosks or hotel reception for essentials, but exact opening hours vary.

## School holiday travel impact

Each guide should explain that school holidays do not usually close shops, but they may affect:

- hotels
- trains
- roads
- attractions
- family travel demand
- long weekend planning

The guide should link to Trip Dates or Multi-city Trip for date-specific checks.

## Essentials and fallback categories

City Guides may include practical fallback categories, not exact business listings.

Allowed:

- major train stations
- airports
- gas stations
- kiosks
- cafés
- bakeries
- restaurants
- hotel reception
- official business websites
- Google Maps verification

Not allowed in MVP:

- exact shop opening hours
- ranked restaurant recommendations
- tobacco vending machine locations
- live inventory
- paid placement disguised as guidance

## Pharmacies and emergency guidance

City Guides may include careful pharmacy guidance.

Allowed:

- regular pharmacies may be closed on Sundays and public holidays
- emergency pharmacies change by date and location
- travelers should check official Notdienst-Apotheke services, Google Maps or pharmacy websites
- call 112 for medical emergencies
- call 110 for police emergencies
- use 116117 for non-emergency medical on-call help outside regular office hours

Not allowed:

- diagnosis
- treatment advice
- exact emergency pharmacy listings maintained by the app
- AI-generated medical decisions
- emergency room recommendations

## Internal linking

Each City Guide should link to:

- Check Today with the city preselected later
- Check Trip Dates with the city preselected later
- Multi-city Trip for travelers visiting more than one city
- Schulferienklar as the data source where appropriate

Initial static links may point to section anchors until route-based pages exist.

## SEO direction

City Guides should target practical search intent.

Example search intents:

- are shops open in Berlin on Sunday
- Germany Sunday closures Munich
- public holidays Berlin travel
- school holidays Bavaria travel
- pharmacies open Sunday Germany
- Berlin public holiday shops closed
- Munich holiday closures

The tone should stay factual, helpful and cautious.

## What City Guides must not become

City Guides must not become:

- generic attraction guides
- restaurant blogs
- hotel recommendation pages
- nightlife guides
- AI-generated travel itineraries
- exact opening-hour databases
- emergency service directories

They should remain focused on practical closure and trip timing checks.

## MVP implementation direction

The first implementation can be simple.

Recommended first code phase:

- add static city guide data file
- add reusable city guide component
- create one Berlin guide section or route
- link it from the landing page
- repeat for Munich after the pattern works

The first version does not need a full router if the app remains a single-page app.

Possible approaches:

1. Single-page sections for city guides
2. Simple hash-based city guide navigation
3. Static generated pages later

## Future extensions

Later versions may add:

- dedicated routes for each city
- preselected city query parameters
- city-specific OG metadata
- city guide sitemap entries
- guide pages for more German cities
- cross-border trip notes
- affiliate experiments where appropriate
