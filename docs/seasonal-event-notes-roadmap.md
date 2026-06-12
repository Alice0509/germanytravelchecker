# Seasonal event notes roadmap

Germany Travel Checker should help travelers understand when a German travel date is not only affected by a school holiday, Sunday or public holiday, but also by a major local event season.

This should not become a full event calendar. The goal is to add careful notes for a small number of high-impact city and season combinations, using official sources.

## Product goal

When a trip date overlaps a known high-impact local event season, the planner can show a small seasonal event note.

The note should explain:

- what might be different
- what the traveler should verify
- where to check official information

The product flow should stay simple:

calendar signal -> travel consequence -> next step -> official source

## Source rules

Seasonal event notes should use official or city-level sources whenever possible.

Good sources:

- official city tourism pages
- official event websites
- official city event pages
- official transport pages when relevant

Avoid using:

- travel blogs as source data
- hotel booking pages as source data
- unofficial event aggregators as authoritative data
- social media posts as primary sources

## What the feature should not do

Seasonal event notes must not claim:

- that a specific venue is open today
- that a specific event is definitely happening without official confirmation
- that all events in a city are covered
- that live transport or crowd conditions are known
- that the site provides ticket availability, reservations or real-time alerts

Every note should make clear that official event dates, opening hours and transport changes can change.

## MVP candidates

### Nuremberg — Christkindlesmarkt season

Why it matters:

- major Christmas market season
- old town and Hauptmarkt can be much busier
- hotels, restaurants and trains may require earlier planning
- December trips can feel very different from normal weekdays

Initial date window:

- late November to December
- first implementation can focus on the official Christkindlesmarkt date range when available

Official check targets:

- official Christkindlesmarkt website
- official Nuremberg tourism page

Suggested note:

Seasonal event note

Nuremberg can be especially busy around the Christkindlesmarkt season. If your dates overlap the official Christmas market period, check official event dates, opening hours, hotel availability, restaurant plans and transport changes before booking tight transfers.

### Munich — Oktoberfest season

Why it matters:

- major city-wide travel pressure
- accommodation prices and availability can change strongly
- trains, local transport and restaurants can be busier
- first-time visitors may underestimate how much this affects normal trip planning

Initial date window:

- late September to early October
- use official Oktoberfest dates when available

Official check targets:

- official Oktoberfest website
- Munich tourism or city pages when needed

Suggested note:

Seasonal event note

Munich can be much busier during Oktoberfest. If your dates overlap the official Oktoberfest period, check accommodation, local transport and restaurant plans early, and avoid tight transfers around arrival or departure.

### Berlin — New Year period

Why it matters:

- New Year's Eve events, fireworks, crowds and transport changes can affect the city
- exact event formats can change by year
- this is better handled as an official-check prompt than a fixed event promise

Initial date window:

- December 31 and nearby travel days
- avoid hard-coding event details beyond official check links

Official check targets:

- Berlin.de New Year's Eve event page
- official transport sources when added later

Suggested note:

Seasonal event note

Berlin can have special events, crowds, fireworks and transport changes around New Year's Eve. Check official city event pages and live transport updates before relying on tight plans.

## First implementation proposal

Start with Nuremberg Christkindlesmarkt only.

Reason:

- strong traveler impact
- clear city-season fit
- official event and tourism sources exist
- useful for trip planning without becoming a broad event calendar

Implementation steps:

1. Add src/data/seasonalEventNotes.js
2. Match by city ID and date overlap
3. Return a small note object with title, summary, date window and official links
4. Show the note in Trip Dates results
5. Show matching notes inside Multi-city segment results
6. Keep disclaimer language clear: official event dates and opening hours can change

## Possible data shape

Fields:

- id
- cityId
- title
- startDate
- endDate
- summary
- links

Example values:

- id: nuremberg-christkindlesmarkt
- cityId: nuremberg
- title: Seasonal event note: Christkindlesmarkt
- startDate: 2026-11-27
- endDate: 2026-12-24
- links:
  - Official Christkindlesmarkt site
  - Official Nuremberg tourism page

## Display guidance

The note should be separate from public holiday and school holiday warnings.

Recommended label:

Seasonal event note

Recommended placement:

- after risk summary
- before live Google Maps checks
- inside each affected multi-city segment

Recommended tone:

- practical
- cautious
- official-source oriented
- not alarmist

## Success criteria

A traveler using the planner should understand:

- this date may be affected by a major local event season
- this may change crowds, hotels, transport or restaurant planning
- the site is not guaranteeing exact event operations
- official event pages should be checked before booking tight plans
