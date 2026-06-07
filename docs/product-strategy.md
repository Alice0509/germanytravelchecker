# Germany Travel Checker Product Strategy

## Product definition

Germany Travel Checker is an English-language travel trouble checker for visitors to Germany.

It is not a general travel blog and not a duplicate of Schulferienklar.

It helps travelers understand and avoid practical Germany-specific travel trouble around:

- public holidays
- Sunday closures
- school holiday travel crowds
- groceries, water and Sunday/public-holiday essentials
- cigarettes and kiosks
- cafés and bakeries
- pharmacies and emergency pharmacy guidance
- basic trip timing and transfer-day trouble

The product should answer practical questions before or during a trip:

- Is anything closed today?
- Is my travel date affected by a public holiday?
- Are regular supermarkets likely to be closed?
- Can I still find water, food, cafés, bakeries or pharmacies?
- Will my trip dates be busy because of school holidays?
- Which German federal state applies to the city I am visiting?

## Relationship to Schulferienklar

Schulferienklar remains the German-first calendar product for official school holidays and public holidays.

Germany Travel Checker is a separate English travel product.

Schulferienklar should remain simple, official-data focused and independent.

Germany Travel Checker may use Schulferienklar public data as a source, but it should have its own:

- domain
- repository
- design language
- product structure
- monetization path
- English-first user experience

## Target users

Initial target users:

- travelers from the United States
- travelers from Canada
- travelers from Australia
- travelers from the United Kingdom
- other English-speaking visitors to Germany
- travelers already in Germany who need quick practical information
- travelers planning multi-city trips in Germany

The product should assume that many users do not know:

- German federal states
- Sunday closure rules
- regional public holiday differences
- pharmacy emergency service patterns
- school holiday travel effects

## Product pillars

### 1. Check Today

For travelers who are already in Germany.

Primary question:

Is anything important closed or harder today?

Check Today should focus on:

- selected city
- selected date, defaulting to today
- federal state mapping
- Sunday status
- statewide public holiday status
- school holiday period status
- practical fallback guidance for essentials

Check Today is mainly a trust and utility feature.

It should be fast, simple and conservative.

### 2. Check Trip Dates

For travelers planning before they book.

Primary question:

Are my travel dates likely to create avoidable trouble?

Check Trip Dates should focus on:

- date range
- one or more cities
- federal state differences
- public holidays
- school holiday periods
- weekends and bridge-day patterns
- possible crowd, closure and essentials-planning warnings

Check Trip Dates is the stronger SEO and monetization feature.

It can later support affiliate flows such as:

- eSIM
- luggage storage
- train or city passes
- travel insurance
- airport transfers
- tours
- hotel planning

### 3. City Guides

For city-specific practical guidance.

Initial city guide candidates:

- Berlin
- Munich
- Hamburg
- Cologne
- Frankfurt
- Stuttgart
- Dresden
- Nuremberg

City guides should explain:

- which federal state applies
- common Sunday and public holiday closure expectations
- where travelers often check first for essentials
- transport hub fallback logic
- pharmacy and emergency pharmacy guidance
- links back to Check Today and Check Trip Dates

City guides should not become generic travel guides.

They should stay focused on Germany-specific practical trouble: closures, water, Pfand, cash, toilets, pharmacies, essentials and transfer-day friction.

## Data principles

Germany Travel Checker should use stable and reliable data.

Allowed data:

- Schulferienklar school holiday data
- Schulferienklar public holiday data
- city to German federal state mapping
- date and weekday calculations
- rule-based closure guidance
- conservative fallback categories

Data that should not be maintained directly in the MVP:

- individual shop opening hours
- tobacco vending machine locations
- emergency pharmacy duty schedules
- emergency room waiting times
- restaurant recommendations
- real-time crowd data
- live transport disruption data

The app should not pretend to know exact real-time availability unless that data comes from a reliable official or commercial API later.

## Safety principles

The product must be especially careful with medical and emergency information.

Allowed guidance:

- call 112 for medical emergencies or life-threatening situations
- call 110 for police emergencies
- use 116117 for non-emergency medical on-call help outside regular office hours
- check official Notdienst-Apotheke services for emergency pharmacies
- verify pharmacy and business opening hours before going

Not allowed:

- diagnosis
- treatment advice
- symptom triage
- advice to avoid medical care
- exact emergency room availability
- fixed emergency pharmacy listings
- AI-generated emergency medical decisions

## AI principles

AI should not be part of the first product layer.

The first version should be rule-based.

AI may be added later only after the rule-based checker is useful and reliable.

Possible future AI use:

- explain rule-based results in plain English
- summarize official guidance
- help travelers understand multi-city date risks
- generate cautious trip planning explanations

AI must not:

- invent official dates
- guess emergency medical advice
- claim exact shop opening hours
- recommend specific emergency providers without reliable data

## Monetization direction

The product should not start with aggressive monetization.

First priority:

- trust
- usefulness
- SEO
- repeatable travel planning use cases

Likely monetization paths later:

- affiliate links for eSIMs
- luggage storage
- city passes
- airport transfers
- travel insurance
- tours and activities
- hotel planning
- contextual ads, if they do not harm trust

Check Today is mainly a utility and trust feature.

Check Trip Dates and City Guides are stronger long-term monetization surfaces.

## UX direction

The product should feel:

- calm
- practical
- trustworthy
- mobile-first
- friendly to first-time Germany visitors
- more like a checker than a blog

The user should quickly understand:

- what city they are checking
- what date they are checking
- whether there is a risk
- why there is a risk
- what to check next
- what the app cannot guarantee

## Roadmap

### Phase 1: Foundation

- domain setup
- landing page
- Schulferienklar data service
- city mapping
- Check Today result logic
- Check Today UI
- basic SEO files

### Phase 2: Product clarity

- product strategy
- copy polish
- mobile layout polish
- stronger trust and data-source messaging
- clearer separation from Schulferienklar

### Phase 3: Check Trip Dates MVP

- date range input
- one-city trip check
- public holiday and school holiday overlap
- risk summary
- rule-based travel timing guidance

### Phase 4: Multi-city planning

- multiple cities
- city to state mapping
- date range segments
- per-city risk cards
- trip summary

### Phase 5: City guide SEO

- Berlin guide
- Munich guide
- Hamburg guide
- Frankfurt guide
- Cologne guide
- internal links to Check Today and Check Trip Dates

### Phase 6: Monetization experiments

- affiliate experiments
- search-driven landing pages
- careful ads or sponsorships
- no trust-damaging placements

## Long-term vision

Germany Travel Checker should become the practical English companion for understanding how German holidays, closures and regional differences affect a trip.

It should help travelers avoid avoidable surprises without pretending to replace official sources, Google Maps, emergency services or local businesses.
