# Homepage and Planner Split Review

## Current State

Germany Travel Checker now has:

- a homepage with Check Today and planning entry points
- a dedicated `/planner.html` page with Check Trip Dates and Multi-city Trip
- Berlin and Munich city guide pages
- trouble-focused guidance for water, groceries, pharmacies, cash, Pfand, transfers and live checks

The main homepage planning CTAs now point to `/planner.html`.

## Product Direction

Homepage should be a fast entry point.

Planner should be the deeper planning surface.

City guides should be city-specific trouble companions.

## Recommended Future Homepage Role

Homepage should focus on:

- hero trouble-checker positioning
- Check Today
- one clear planner entry
- City Guides preview
- trust and safety note
- footer

Homepage should not become:

- a duplicated planner page
- a generic travel blog page
- a list of unsupported future features
- a page full of generic external links

## Planner Page Role

Planner should contain:

- Check Trip Dates
- Multi-city Trip
- trip date essentials warnings
- city-specific live checks
- risky segment live checks
- transfer-day essentials guidance
- planner FAQ
- planner next steps
- city guide links
- trust and safety notes

## Split Criteria

Consider reducing homepage planning sections when most of these are true:

- `/planner.html` is included in the public build and sitemap
- `/planner.html` returns 200 in production
- homepage CTAs to `/planner.html` work
- planner page mobile layout is stable
- planner footer and internal links are visually consistent
- Check Trip Dates works correctly inside `/planner.html`
- Multi-city Trip works correctly inside `/planner.html`
- Search Console and Bing can inspect `/planner.html`
- no major visual regression is present on homepage or planner

## Possible First Split Step

Do not remove all planning content at once.

First safe step:

- keep Check Today fully visible on homepage
- keep homepage mode cards
- turn one-city and multi-city cards into planner teaser cards
- link planning actions to `/planner.html`

Later step:

- remove full planning sections from homepage only after planner behavior is stable in production

## Risk Controls

Before any homepage/planner split PR:

- run `npm run build`
- check `/`
- check `/planner.html`
- check mobile layout
- verify no homepage CSS class names were removed accidentally
- verify TripDates and MultiCityTrip still work on planner
- avoid large App.jsx rewrites

## Decision

For now, keep the homepage stable.

Next homepage changes should be small, copy/link-only or teaser-focused until the planner page has proven stable in production.
