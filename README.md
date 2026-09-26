# WINDOW 🪟🌎

**Somewhere else on Earth, right now.**

WINDOW is a quiet portal into real places. No feed. No accounts. No fake live footage.

## Founding rule
**IF YOU CAN SEE IT, IT'S THERE.**

Every view must disclose its source and status: LIVE, NEAR-LIVE, or OFFLINE. Never present prerecorded footage as live.

## v0.1
The first build establishes the experience and source contract. Camera entries live in `cameras.js`; only embeddable, verifiable sources should be added.

Open → see somewhere → **SOMEWHERE ELSE →**


## Source expansion
WINDOW now spans Monterey Bay, African wildlife at Mpala, and a verified 24/7 Odaiba Tokyo stream. Iceland and beach sources are being admitted only when the underlying operator/embed can be verified; directories alone are not treated as proof of an embeddable live feed.


## WINDOW SEEKER — v0.2

WINDOW now accepts a place name or `lat, lng` pair and ranks the verified camera registry by great-circle distance.

**Contract:** location in → closest legitimate public view out.

Current v0.2 discovery is intentionally conservative: it searches the curated verified registry rather than probing arbitrary IP cameras. Future adapters may ingest legitimate public catalogs (transportation/511, weather, parks, observatories, webcam providers) into one normalized camera contract with coordinates, heading/FOV when known, freshness, availability, media type, source URL, and rights/provenance.

Planned ranking dimensions: distance, reachability, freshness, LIVE vs NEAR-LIVE, direction/FOV, daylight, quality, and target visibility.

EARTH NOW integration target: pass an event coordinate to WINDOW SEEKER and return the closest trustworthy visual observation.


## WINDOW SEEKER — discovery architecture

SEEKER now has a provider-neutral adapter layer. The curated registry works entirely in-browser. Credentialed large-scale providers are reserved for `/api/seek`, so provider secrets never ship in the public client.

See `api-contract.md` for the normalized discovery-service schema and safety/provenance rules.

The first planned credentialed adapter is Windy Webcams v3 for global nearby discovery, followed by compatible public 511/DOT camera catalogs. These are architecture targets, not claimed active integrations until credentials and deployment exist.


## Discovery service implementation

`server/seek.mjs` now implements the first credentialed provider adapter. It validates coordinates, queries Windy Webcams v3 within 250 km when `WINDY_WEBCAMS_API_KEY` is configured server-side, normalizes returned public views into the WINDOW camera contract, isolates provider failure, and emits short-lived cache headers.

It deliberately labels provider results `NEAR-LIVE` unless WINDOW has stronger evidence for a live-video state. No credential is present in this repository and global Windy discovery is therefore not active until a serverless runtime and secret are configured.

The static site remains usable through the curated adapter when the discovery endpoint is unavailable.


## BEST VIEW ranking

SEEKER now ranks candidates by an explicit heuristic rather than distance alone. The current score combines proximity, source status (LIVE/NEAR-LIVE), media type, declared freshness when available, and camera heading when known. Unknown heading is not penalized as if it were known to be wrong.

The score is a search heuristic, not a factual claim that a camera can see the requested target. Candidate count, winning distance and score are surfaced in the UI. As adapters gain field-of-view and reachability metadata, those signals can be added without changing the source contract.


## Deploying discovery

The repository now includes a serverless `/api/seek` entry point and deployment configuration. Configure `WINDY_WEBCAMS_API_KEY` only in the deployment environment; never commit it or expose it to browser JavaScript.

The static GitHub Pages build continues to fall back to the curated registry. A deployment that serves both the site and `/api/seek` activates credentialed discovery without changing the client contract.

Windy media should be treated as short-lived provider data: preserve the source URL/attribution and do not persist expiring image URLs as durable camera records.
