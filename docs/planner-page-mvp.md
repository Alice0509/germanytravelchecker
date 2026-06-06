# Planner Page MVP

## Goal

Create a dedicated planning page for English-speaking visitors to Germany.

The planner page should help travelers check whether their trip dates may be affected by:

- Sundays
- German public holidays
- school holiday travel pressure
- multi-city transfer days
- limited shopping options
- pharmacy and emergency fallback needs

The MVP should stay focused on practical Germany-specific travel friction. It should not become a full itinerary builder.

## Why This Page Exists

The homepage currently contains several useful tools:

- Check Today
- Check Trip Dates
- Multi-city Trip
- City Guides preview

This is useful, but the homepage can become too long.

The planner page creates a clearer product structure:

- Homepage: quick entry point and today-focused checker
- Planner page: trip date and multi-city planning tools
- City guides: city-specific practical guidance

## Proposed URL

Recommended MVP URL:

/planner.html

Reasons:

- short and memorable
- product-like
- flexible enough for single-city and multi-city planning
- less SEO-spammy than /germany-trip-date-checker.html

## Target Users

The planner page is for English-speaking visitors who are:

- planning a Germany trip before departure
- checking whether travel dates overlap with Sundays or holidays
- visiting more than one German city
- trying to avoid inconvenient transfer days
- unfamiliar with German Sunday closures and state-specific public holidays

## SEO Intent

The page should target searches such as:

- Germany trip date checker
- Germany travel planner
- Germany Sunday closure checker
- Germany public holiday travel checker
- Germany school holiday travel checker
- Germany multi city trip planner
- Are shops open in Germany on my travel dates?
- Is my Germany trip during school holidays?

## Main Tools

### Check Trip Dates

Purpose:

Help travelers check one city across a date range.

Inputs:

- City
- Start date
- End date

Outputs:

- Sunday overlap
- public holiday overlap
- school holiday overlap
- practical risk summary
- fallback guidance for groceries, cafes, bakeries, pharmacies, and planning

MVP principles:

- use rule-based logic
- do not provide exact shop opening hours
- do not claim that a specific shop is open
- encourage users to verify hours through Google Maps and official business websites

### Multi-city Trip

Purpose:

Help travelers check city-by-city trip segments.

Inputs:

- City segments
- Date range for each segment

Outputs:

- segment-level risk
- transfer day detection
- Sunday overlap
- public holiday overlap
- school holiday overlap
- overall itinerary risk

Transfer days should receive special attention because closures and crowds are more stressful when travelers are carrying luggage, changing hotels, or taking trains.

## Recommended Page Structure

1. Header
2. Check Trip Dates
3. Multi-city Trip
4. Practical planning notes
5. Trust and safety notes

The header should use practical travel language, not generic AI or SaaS wording.

Good direction:

Plan around German Sundays, public holidays and school holiday travel peaks.

Avoid:

Optimize your seamless travel experience with intelligent insights.

## Homepage Relationship

The homepage should eventually become lighter.

Recommended homepage structure:

1. Hero
2. Check Today
3. Short explanation of German travel quirks
4. Planner entry card
5. City Guides preview
6. Footer

Recommended split:

Homepage keeps:

- Check Today
- compact entry point to planning tools
- City Guides preview

Planner page contains:

- full Check Trip Dates
- full Multi-city Trip
- planning-specific guidance

## Product Principles

The planner page should follow these principles:

- rule-based guidance first
- no exact shop opening hours
- no live pharmacy duty schedule management
- no medical diagnosis
- no medical triage
- no fake Coming Soon blocks
- no AI itinerary generation in the MVP
- no affiliate links or ads in the MVP

## Trust and Safety Notes

The page should clearly state:

- it does not provide exact opening hours
- it does not replace official medical or emergency advice
- emergency pharmacy duty schedules must be checked through official Notdienst sources
- business opening hours should be verified with Google Maps or official business websites
- public transport disruptions are not checked in the MVP

## MVP Non-Goals

The planner page will not include:

- AI itinerary generation
- hotel booking
- train booking
- live Deutsche Bahn disruption checks
- live shop opening hours
- live pharmacy duty rota data
- medical diagnosis
- medical triage
- affiliate monetization
- ads
- user accounts

## Success Criteria

The MVP planner page is successful if a traveler can answer:

- Does my trip include a Sunday?
- Does my trip overlap with a public holiday?
- Could school holidays increase travel pressure?
- Which city segment looks most risky?
- Are any transfer days potentially inconvenient?
- What should I double-check before relying on shops, pharmacies, or opening hours?

## Implementation Notes

Suggested implementation sequence:

1. Create /planner.html or an equivalent React route.
2. Move or duplicate Check Trip Dates into the planner page.
3. Move or duplicate Multi-city Trip into the planner page.
4. Add a planner entry card on the homepage.
5. Add planner link to footer or navigation.
6. Add planner page to sitemap.
7. Update README feature list.
8. Add planner checks to docs/qa-checklist.md.

## Open Decisions

- Should /planner.html be a static page or React-rendered route?
- Should the homepage keep compact planning tools or only link to the planner?
- Should planner results link to Berlin and Munich city guides when relevant?
- Should the planner include what to do instead suggestions for each risk type?

## Recommended Next Step

After this document is committed, review the homepage IA.

The next product decision should be:

What stays on the homepage, and what moves to /planner.html?
