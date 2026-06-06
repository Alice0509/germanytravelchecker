# Homepage IA MVP

## Goal

Clarify the role of the Germany Travel Checker homepage after introducing the Planner Page MVP.

The homepage should be a light, useful product entry point for English-speaking visitors to Germany.

It should not try to contain every full planning tool permanently.

## Homepage Role

The homepage should answer this first question:

What should I know about Germany today or on a specific travel day?

The homepage should feel fast, practical, and easy to understand.

It should introduce the product and give users a useful result quickly.

## Product Structure

Recommended structure:

- Homepage: quick entry point and Check Today
- Planner page: Check Trip Dates and Multi-city Trip
- City guides: city-specific practical guidance

This keeps the product easier to understand.

## Recommended Homepage Sections

### 1. Hero

Purpose:

Explain the product in clear travel language.

Suggested direction:

Germany has Sundays, state holidays, and school breaks that can affect your trip. Check your city and date before you rely on shops, pharmacies, or travel plans.

Avoid generic wording such as:

- AI-powered travel intelligence
- seamless optimization
- smart insights for every journey

### 2. Check Today

Purpose:

Keep the main homepage tool focused on a quick city and date check.

This should remain the primary interactive feature on the homepage.

Inputs:

- City
- Date

Outputs:

- Sunday status
- public holiday status
- school holiday status
- practical guidance for water, groceries, cafes, bakeries, tobacco, pharmacies, and emergency fallback

Detailed guidance can stay collapsed behind a practical details toggle.

### 3. Germany Travel Quirks

Purpose:

Briefly explain why the checker exists.

Topics:

- many shops close on Sundays
- public holidays vary by federal state
- school holidays can increase travel pressure
- pharmacy emergency duty schedules must be checked through official sources
- exact opening hours should be verified through Google Maps or official business websites

This section should be concise and practical.

### 4. Planner Entry Card

Purpose:

Send deeper planning intent to the future planner page.

Suggested card direction:

Planning several days or multiple cities?

Check whether your Germany trip overlaps with Sundays, public holidays, school holidays, or risky transfer days.

Primary link:

/planner.html

This card can mention:

- Check Trip Dates
- Multi-city Trip

But the full tools should eventually live on the planner page.

### 5. City Guides Preview

Purpose:

Give users a path to practical city-specific guidance.

Current guide links:

- Berlin
- Munich

This section should stay compact.

### 6. Footer

Footer should keep:

- Impressum
- Datenschutz
- Schulferienklar

Public GitHub link should stay removed from the footer.

## What Should Stay on the Homepage

Keep:

- Hero
- Check Today
- short Germany travel quirks explanation
- planner entry card
- City Guides preview
- footer legal links

## What Should Move to Planner

Move or reduce:

- full Check Trip Dates
- full Multi-city Trip
- detailed multi-day planning guidance

The homepage may keep compact teaser cards for these tools, but not the full versions long term.

## UX Principles

The homepage should feel:

- bright
- practical
- travel-oriented
- trustworthy
- easy to scan
- less like a generic AI landing page

Avoid:

- too many full tools stacked vertically
- fake Coming Soon sections
- overpromising exact opening hours
- medical or emergency advice beyond safe official guidance
- generic SaaS copy
- cluttered footer links

## Recommended MVP Change

Before building /planner.html, the homepage can be lightly adjusted:

1. Keep Check Today prominent.
2. Add a clearer planner teaser card.
3. Reduce visual weight of Check Trip Dates and Multi-city Trip if they remain temporarily.
4. Make it clear that deeper planning belongs on the planner page.
5. Keep Berlin and Munich guide preview below the main tools.

## Future Code Sequence

Suggested order:

1. Create /planner.html.
2. Move or duplicate Check Trip Dates to /planner.html.
3. Move or duplicate Multi-city Trip to /planner.html.
4. Add homepage planner entry card.
5. Reduce homepage planning tools to compact teasers.
6. Add /planner.html to sitemap.
7. Update README.
8. Update QA checklist.

## Success Criteria

The homepage IA is successful if a first-time visitor can quickly understand:

- what the site does
- which city and date they should check
- why Germany has travel-specific closure risks
- where to go for multi-day or multi-city planning
- where to find city-specific guidance

The homepage should feel useful within the first few seconds.
