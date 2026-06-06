# Check Trip Dates MVP

## Purpose

Check Trip Dates is the planning-focused part of Germany Travel Checker.

It helps English-speaking travelers understand whether their planned Germany trip dates may be affected by:

- public holidays
- Sundays
- school holiday periods
- long weekends
- possible bridge-day patterns
- city and federal state differences
- likely travel crowd periods

This feature is for travelers before they book or while they are still adjusting their itinerary.

## Core user question

Are my Germany travel dates risky, busy or inconvenient?

Examples:

- Is my Berlin trip affected by a public holiday?
- Are shops likely to be closed during my Munich dates?
- Is this a school holiday period in Bavaria?
- Will trains, hotels or attractions be busier?
- Is this a good weekend for a short Germany trip?
- Does my trip include different federal states?

## MVP scope

The first MVP should support:

- one city
- one date range
- start date
- end date
- city to federal state mapping
- public holiday overlap
- school holiday overlap
- Sunday detection
- basic risk level
- simple trip summary
- practical travel warnings

The MVP should not support multi-city itineraries yet.

## Input

Required inputs:

- city
- start date
- end date

Optional later inputs:

- trip purpose
- traveler type
- interests
- arrival city
- departure city
- flexibility level

## Output

The result should include:

- city name
- federal state
- selected date range
- number of trip days
- risk level
- public holidays within the range
- Sundays within the range
- school holiday periods overlapping the range
- plain-English summary
- practical guidance
- disclaimer

## Risk levels

Suggested initial risk levels:

### Low

No public holiday, no Sunday-heavy issue, no school holiday overlap.

Example:

Your dates look fairly normal for Berlin. Regular shop opening patterns are more likely, but exact hours still vary by business.

### Medium

One or more mild issues:

- includes a Sunday
- overlaps school holidays
- near a holiday period
- possible travel crowd warning

Example:

Your trip includes a Sunday and overlaps a school holiday period. Shops may be closed on Sunday, and trains, hotels or attractions may be busier.

### High

One or more strong issues:

- includes a public holiday
- public holiday plus weekend
- multiple closure days
- strong school holiday overlap
- likely long weekend effect

Example:

Your trip includes a public holiday in Bavaria. Regular shops and supermarkets are usually closed on public holidays, and travel demand may be higher around the long weekend.

## Data sources

Check Trip Dates should use:

- Schulferienklar school holiday data
- Schulferienklar public holiday data
- city to federal state mapping
- date and weekday calculations
- conservative rule-based guidance

The feature should not rely on AI for the first version.

## What the MVP must not do

The MVP must not provide:

- exact shop opening hours
- hotel price predictions
- train fare predictions
- real-time transport disruptions
- restaurant recommendations
- exact pharmacy duty schedules
- exact crowd data
- medical advice
- booking recommendations

## Practical guidance categories

The feature may include guidance for:

- shops and supermarkets
- public holidays
- Sundays
- groceries and water
- cafés and bakeries
- pharmacies
- train stations and airports
- attractions and museums
- school holiday travel crowds

## Monetization relevance

Check Trip Dates is more monetizable than Check Today because it reaches travelers before they book.

Possible future affiliate surfaces:

- eSIM
- travel insurance
- luggage storage
- airport transfer
- train or city pass
- hotel planning
- tours and activities

The MVP should not include affiliate links yet.

First priority is trust and usefulness.

## UX direction

The UI should be simple:

1. Choose city
2. Choose start date
3. Choose end date
4. See trip risk summary

The result should be scannable on mobile.

Recommended sections:

- Overall trip risk
- What affects your dates
- What to plan around
- What to verify before you go

## Suggested result copy

### Normal dates

Your dates look fairly normal for this city. Regular shops, supermarkets, cafés and services are generally more likely to follow normal opening patterns, but exact hours still vary by business.

### Sunday included

Your trip includes a Sunday. In Germany, many regular shops and supermarkets are usually closed on Sundays. Train stations, airports, gas stations, cafés, bakeries, restaurants and hotels may be useful fallback options.

### Public holiday included

Your trip includes a public holiday in this federal state. Regular shops and supermarkets are usually closed on public holidays. Check official opening hours before relying on shops, attractions or services.

### School holiday overlap

Your trip overlaps a school holiday period. Shops are not usually closed because of school holidays, but trains, hotels, roads and attractions may be busier.

## Future extensions

After the one-city MVP works, future versions may add:

- multi-city trip segments
- route-based checks
- trip calendar view
- risk timeline
- city guide links
- affiliate experiments
- AI explanation layer
