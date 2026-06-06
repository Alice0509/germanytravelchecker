# Planner Implementation Options

## Goal

Decide how to implement the future planner page for Germany Travel Checker.

The planner page should eventually contain the full planning tools:

- Check Trip Dates
- Multi-city Trip

The page should support the product direction documented in:

- docs/planner-page-mvp.md
- docs/homepage-ia-mvp.md

## Product Context

Germany Travel Checker is a practical travel checker for English-speaking visitors to Germany.

The planner page should not be a placeholder or a fake coming-soon page.

It should become a real planning surface for users who want to check several travel dates or multiple German cities.

## Key Requirement

The implementation should allow reuse of existing React logic and components.

Important existing tools:

- Check Trip Dates
- Multi-city Trip
- rule-based holiday and school holiday checks
- practical fallback guidance

Because these tools already exist in the React app, the planner page should avoid duplicating business logic in a separate static HTML file.

## Option 1: Static public/planner.html

This option would add a standalone file at:

/public/planner.html

### Pros

- Very simple to create
- Direct URL works on GitHub Pages
- Low risk for the existing React app
- Useful for a basic informational page

### Cons

- Does not easily reuse React components
- Risks duplicating content and logic
- Could become a thin shell instead of a real product page
- Makes future migration of Check Trip Dates and Multi-city Trip harder
- Can drift away from the main app design system

### Assessment

This option is not recommended for the planner MVP.

It may be acceptable only for legal pages or simple static city guide pages, but the planner page is a product surface and should reuse app logic.

## Option 2: React SPA Route

This option would keep one React app and add route-based rendering.

Example paths:

- /
- /planner
- /berlin
- /munich

### Pros

- Clean app structure
- Good component reuse
- Natural for a React product
- Easier to share layout, state, and design patterns

### Cons

- GitHub Pages direct URL handling needs care
- The current product uses .html URLs for static pages
- The desired MVP URL is /planner.html
- May require routing setup that is larger than needed right now

### Assessment

This is a good long-term direction if the product becomes a larger React app.

For the immediate planner MVP, it may be more structural change than necessary.

## Option 3: Vite Multi-page Entry

This option would add a second Vite HTML entry for the planner page.

Example:

- index.html for the homepage
- planner.html for the planner page

Both pages can mount React and reuse shared components.

### Pros

- Supports direct /planner.html URL
- Fits the existing .html page pattern
- Allows React component reuse
- Avoids a fake static shell
- Keeps homepage and planner as separate product surfaces
- Works well with GitHub Pages style deployment
- Allows gradual migration of Check Trip Dates and Multi-city Trip

### Cons

- Requires some Vite structure work
- Needs shared layout and component organization
- May need careful asset path testing
- Slightly more complex than a static public page

### Assessment

This is the recommended implementation direction for the planner MVP.

It balances direct URL support, React reuse, and small-step product evolution.

## Recommended Direction

Use a Vite multi-page entry for the planner page.

Recommended target URL:

/planner.html

Recommended structure:

- homepage stays at /
- planner page exists at /planner.html
- planner page uses React
- planner page reuses Check Trip Dates and Multi-city Trip components
- homepage can later link to planner and reduce planning tools to teasers

## What Not To Do

Do not create a fake coming-soon planner page.

Do not create a static planner shell that cannot reuse the existing React tools.

Do not remove Check Trip Dates or Multi-city Trip from the homepage until the planner page is usable.

Do not add AI itinerary generation in the planner MVP.

Do not add affiliate links, ads, live shop hours, or live emergency pharmacy rota data in the planner MVP.

## Suggested Implementation Sequence

1. Prepare shared React components if needed.
2. Add planner.html as a Vite multi-page entry.
3. Add a planner React entry file.
4. Render Check Trip Dates and Multi-city Trip on the planner page.
5. Add practical planner intro copy.
6. Add homepage link or card to /planner.html.
7. Add /planner.html to sitemap.xml.
8. Update README.
9. Update docs/qa-checklist.md.
10. Deploy and verify direct access to /planner.html.

## Homepage Relationship

The homepage should not be reduced before the planner page is usable.

Recommended order:

1. Build usable planner page.
2. Add homepage entry point to planner.
3. Verify deployment.
4. Then reduce Check Trip Dates and Multi-city Trip on the homepage if the page feels too long.

## Success Criteria

The implementation is successful if:

- /planner.html works directly after deployment
- existing React components can be reused
- users can run Check Trip Dates on the planner page
- users can run Multi-city Trip on the planner page
- homepage remains functional
- no duplicate rule logic is introduced
- no fake coming-soon UI is added
