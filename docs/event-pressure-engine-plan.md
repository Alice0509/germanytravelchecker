# Event pressure engine plan

Germany Travel Checker should help travelers notice when one of the supported cities may be harder than usual because of a major event.

This is not a live crowd tracker and not a complete event calendar. The goal is to show selected event pressure signals for major events that may affect transport, hotels, stations, venues or late-night movement.

## Supported cities

Initial scope is limited to the cities already supported by Germany Travel Checker:

- Berlin
- Munich
- Hamburg
- Cologne
- Frankfurt
- Stuttgart
- Dresden
- Nuremberg

Do not expand beyond these cities until the source strategy, confidence rules and UI behavior are stable.

## Product goal

The event pressure engine should answer this traveler question:

Is there a major event signal on this date that may make the city harder than usual for travel?

The engine should not claim:

- that a city is crowded right now
- that a specific train, U-Bahn, restaurant, hotel or shop is affected
- that the event list is complete
- that the app has live crowd data

## Display language principles

Use cautious signal language.

Good wording:

- Major event signal
- Event pressure may affect transport, hotels or late-night travel
- Not live crowd data
- Verify official venue and transport sources

Avoid:

- Munich is crowded today
- Transport will be disrupted
- Hotels are full
- This city is unsafe
- All events are covered

## Event types to include

Include only events likely to affect travelers at city scale or neighborhood and transport scale:

- stadium concerts
- major football matches
- major trade fairs and Messe events
- city festivals with transport or crowd pressure
- Christmas markets
- Oktoberfest and Volksfest periods
- New Year city events
- large venue events near important transport corridors

## Event types to exclude

Exclude low-signal events:

- small club concerts
- small exhibitions
- local neighborhood events
- events with unclear dates
- events without a reliable source URL
- events where the venue or city cannot be determined
- scraped content without enough confidence

## Source priority

Prefer sources in this order:

1. Official city, tourism, venue, Messe or organizer pages
2. Official transport operator notices when relevant
3. Major venue calendars
4. Reputable ticket or event platforms only as secondary confirmation
5. General search or LLM-based extraction only as discovery, not as final source

A notice should not be displayed without at least one reliable source URL.

## Data contract

A data contract is the agreed shape of the generated event pressure data.

The discovery script may gather messy source data, but the app should only read clean normalized objects matching this contract.

Example object:

    {
      "id": "munich-2026-07-11-major-stadium-event",
      "city": "Munich",
      "state": "Bavaria",
      "startDate": "2026-07-11",
      "endDate": "2026-07-12",
      "category": "stadium_event",
      "pressureLevel": "high",
      "title": "Major stadium event",
      "venue": "Allianz Arena",
      "affectedAreas": ["Fröttmaning", "U-Bahn", "hotels", "late-night transport"],
      "travelerImpact": "Large event dates may affect U-Bahn connections, hotels, stations and late-night travel.",
      "recommendedAction": "Add buffer time and verify official venue and transport sources before travelling.",
      "verifyLinks": [
        {
          "label": "Official venue information",
          "url": "https://example.com"
        }
      ],
      "sourceType": "official_venue",
      "sourceCheckedAt": "2026-07-11",
      "confidence": "medium",
      "displayMode": "banner"
    }

## Required fields

Each generated event pressure note must include:

- id
- city
- startDate
- endDate
- category
- pressureLevel
- title
- travelerImpact
- recommendedAction
- verifyLinks
- sourceType
- sourceCheckedAt
- confidence

## Field rules

### id

Stable unique identifier.

Recommended format:

    city-yyyy-mm-dd-short-slug

Example:

    munich-2026-07-11-major-stadium-event

### city

Must be one of:

- Berlin
- Munich
- Hamburg
- Cologne
- Frankfurt
- Stuttgart
- Dresden
- Nuremberg

### startDate and endDate

Use ISO date format:

    YYYY-MM-DD

If the event lasts one day, startDate and endDate should be the same.

### category

Allowed MVP values:

- stadium_event
- football_match
- trade_fair
- city_festival
- christmas_market
- oktoberfest
- new_year
- transport_event
- other_major_event

### pressureLevel

Allowed values:

- medium
- high

Do not display low-pressure events.

### title

Keep generic when possible.

Good examples:

- Major stadium event
- Major trade fair
- Christmas market season
- Oktoberfest period

Avoid over-promising or overly specific labels unless the official source is clear.

### travelerImpact

Explain what may be harder for travelers:

- U-Bahn, S-Bahn or tram pressure
- station crowding
- hotel availability
- late-night return travel
- road closures
- airport or station arrival timing
- venue neighborhood pressure

### recommendedAction

Give one practical next move.

Examples:

- Add buffer time around station transfers.
- Check the official venue and local transport operator before travelling.
- Book late-night return plans earlier.
- Avoid tight connections near the event area.

### verifyLinks

At least one link is required.

Each link must have:

- label
- url

Prefer official sources.

### sourceType

Allowed values:

- official_city
- official_tourism
- official_venue
- official_messe
- official_transport
- ticket_platform_secondary
- manual_reviewed

### confidence

Allowed values:

- medium
- high

Do not auto-display low-confidence notes.

### displayMode

Allowed values:

- banner
- planner_note

MVP should mostly use banner.

## UI placement

### Check Today

Show a small banner inside or near the Check Today result when:

- selected city matches
- selected date overlaps the event date range
- confidence is medium or high
- pressureLevel is medium or high

Suggested copy:

Major event signal. Large event dates may affect transport, hotels or late-night travel. Not live crowd data. Verify official venue and transport sources.

### Trip planner

Show a small event pressure note when:

- trip city matches
- trip date range overlaps the event date range

Suggested copy:

Major event pressure may affect this date. Add buffer time and verify official venue and transport information.

### Multi-city planner

Show the note inside the affected city segment.

Do not apply a Munich event to Berlin or another city.

## Automation model

Preferred architecture:

    GitHub Actions schedule
    -> discovery script
    -> generated JSON
    -> app reads generated JSON
    -> static deployment

Avoid client-side live scraping.

Reasons:

- no API keys exposed in the frontend
- faster app load
- generated data can be inspected
- static hosting remains simple
- bad data can be reverted through Git

## Automation frequency

MVP:

- once per day

Later:

- twice per day during high travel seasons
- manual trigger before major releases

## Failure behavior

If discovery fails:

- keep the last known generated JSON
- do not block the app build
- log the failure
- do not show stale notes after their end date

If a note is missing required fields:

- skip the note
- log validation error
- do not display partial notices

## Staleness rules

Do not display event pressure notes after endDate.

For upcoming events, display only when the selected date overlaps the event range.

For planner ranges, display when any trip date overlaps the event range.

## Human review

MVP can start with automated PRs instead of direct commits.

Suggested flow:

    scheduled discovery
    -> generated JSON changes
    -> GitHub Action opens PR
    -> review source links and wording
    -> merge

After quality is stable, direct auto-commit can be considered.

## Initial implementation phases

### Phase 1: Plan and contract

- Add this plan
- Define schema
- Define supported city list
- Define display language rules

### Phase 2: Static data support

- Add sample event pressure JSON
- Add utility function to find matching notes by city and date range
- Add small banner UI to Check Today and Planner
- Keep sample data small

### Phase 3: Discovery script

- Add source list for 8 cities
- Fetch source pages or feeds
- Extract event candidates
- Normalize to the data contract
- Validate required fields
- Generate JSON

### Phase 4: GitHub Actions

- Run discovery on schedule
- Generate JSON
- Open PR or commit changes
- Log skipped low-confidence events

### Phase 5: Auto-publish refinement

- Allow high-confidence official-source notes to publish automatically
- Keep lower-confidence notes as PR-only
- Add monitoring for failed discovery runs

## Non-goals

The engine should not become:

- a complete event calendar
- a live crowd tracker
- a ticket search engine
- a hotel availability checker
- a real-time transport disruption system
- a replacement for official venue or transport information

## Success criteria

The feature is successful if:

- travelers get useful warnings for major event pressure dates
- notices are small and not alarmist
- source links are reliable
- the app remains fast and static
- missing events do not create misleading claims
- the system can run without manual city-by-city research every week
