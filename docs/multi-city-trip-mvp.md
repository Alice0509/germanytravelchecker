# Multi-city Trip MVP

## Purpose

Multi-city Trip is the itinerary-focused layer of Germany Travel Checker.

It helps English-speaking travelers understand how public holidays, Sundays, school holiday periods and regional differences affect a trip across multiple German cities.

This feature is especially important because many international visitors do not stay in one German city.

Example trips:

- Munich → Berlin
- Frankfurt → Cologne → Hamburg
- Berlin → Dresden → Munich
- Munich → Nuremberg → Berlin
- Frankfurt → Heidelberg → Stuttgart
- Berlin → Hamburg → Copenhagen
- Berlin → Dresden → Prague

The MVP should focus on German cities first.

Cross-border trips may be mentioned later, but the first version should only calculate German city segments.

## Core user question

Does my Germany itinerary include risky, busy or inconvenient dates in any city?

Examples:

- I will be in Munich from June 5 to June 8 and Berlin from June 8 to June 12. Are any dates risky?
- Does a public holiday affect Bavaria but not Berlin?
- If I travel from Munich to Berlin on a Sunday, what should I plan around?
- Are my hotel or train dates during school holidays?
- Which part of my trip needs the most planning?

## MVP scope

The first MVP should support:

- one trip
- two or more city segments
- each segment has one city
- each segment has a start date
- each segment has an end date
- each city maps to a German federal state
- each segment gets its own trip date risk result
- the full trip gets one overall risk level
- the full trip gets one short summary
- warnings are grouped by segment

The MVP should not support automatic route optimization.

The MVP should not suggest which city to visit first.

## Segment model

A trip is made of segments.

Example:

    Segment 1
    City: Munich
    Start date: 2026-06-05
    End date: 2026-06-08

    Segment 2
    City: Berlin
    Start date: 2026-06-08
    End date: 2026-06-12

Each segment should be evaluated using the same logic as Check Trip Dates:

- city
- federal state
- date range
- Sundays
- public holidays
- school holiday overlaps
- risk level
- warnings
- disclaimer

## Transfer days

Transfer days are tricky because a traveler may be affected by both the departure city and the arrival city.

For the MVP, transfer days should be handled conservatively.

If one segment ends on the same date the next segment starts, that date should be considered a transfer day.

Example:

    Munich: 2026-06-05 → 2026-06-08
    Berlin: 2026-06-08 → 2026-06-12
    Transfer day: 2026-06-08

MVP transfer day rule:

- show the date as part of both segments
- mention that the traveler should check both departure and arrival city conditions
- do not try to decide which city matters more
- do not predict train delays or traffic
- do not provide exact transport advice

Suggested copy:

Your transfer day may be affected by conditions in both the departure and arrival city. Check shops, station services, transport providers and accommodation timing before relying on a specific plan.

## Overall trip risk

The overall trip risk should be derived from segment risks.

Suggested rule:

- if any segment is high risk, the whole trip is high risk
- else if any segment is medium risk, the whole trip is medium risk
- else the whole trip is low risk

The overall result should not hide segment details.

A trip can be generally fine but still have one segment that needs planning.

## Output

The Multi-city Trip result should include:

- overall risk level
- overall title
- overall summary
- number of segments
- total date span
- list of segment results
- transfer day notes
- practical guidance
- disclaimer

Each segment result should include:

- city
- federal state
- start date
- end date
- day count
- segment risk level
- public holiday warnings
- Sunday warnings
- school holiday overlap warnings

## Risk summaries

### Low

Your Germany itinerary looks fairly normal based on public holidays, Sundays and school holiday data. Exact opening hours and transport details should still be checked before relying on specific places.

### Medium

Your Germany itinerary includes dates that may need planning, such as Sundays or school holiday overlaps. Shops may be closed on Sundays, and travel demand may be higher during school holidays.

### High

Your Germany itinerary includes at least one public holiday or strong closure-risk date. Regular shops and supermarkets are usually closed on public holidays, and travel demand may be higher around long weekends.

## UX direction

The MVP UI should be mobile-first.

Recommended flow:

1. Add first city segment
2. Add second city segment
3. Edit city and dates
4. Add another city
5. See overall trip risk
6. See per-city segment cards

Segment cards should be easy to scan.

Suggested card structure:

- City and federal state
- Date range
- Risk badge
- Main warning
- Details accordion or compact list

The first UI can limit the number of segments.

Suggested MVP limit:

- minimum 2 segments
- maximum 5 segments

## Data sources

Use:

- Schulferienklar public holiday data
- Schulferienklar school holiday data
- travel city to federal state mapping
- date utilities
- Trip Dates result builder

Do not use:

- AI
- exact shop opening hours
- train price prediction
- hotel price prediction
- live transport disruption data
- exact crowd data

## What the MVP must not do

The MVP must not:

- suggest medical decisions
- suggest exact emergency pharmacies
- predict train delays
- predict hotel prices
- guarantee that a business is open
- recommend tobacco vending machine locations
- optimize routes
- rank cities

## Monetization relevance

Multi-city Trip is strategically important.

It matches real international travel behavior better than one-city checks.

Possible future monetization surfaces:

- eSIM for entire trip
- luggage storage per city
- train and city pass planning
- travel insurance
- airport transfers
- tours and activities
- hotel planning
- trip planning affiliate pages

The MVP should not include affiliate links yet.

First priority:

- clarity
- trust
- itinerary usefulness
- low-friction mobile UX

## Future extensions

After the MVP, future versions may add:

- automatic transfer day detection
- route timeline
- calendar visualization
- multi-country warnings
- city guide links per segment
- saved itinerary link
- shareable trip check result
- AI explanation layer based on rule-based results
