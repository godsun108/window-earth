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
