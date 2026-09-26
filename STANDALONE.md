# WINDOW — Standalone Architecture

WINDOW is independent software.

## Product promise

**See where you're going before you get there.**

A user can eventually:

1. Enter an origin or use an explicitly granted current location.
2. Enter a destination.
3. Ask WINDOW for a route.
4. Build a LIVE CORRIDOR around that route.
5. Discover intentionally-public cameras and observation sources along it.
6. Rank the most useful views with BEST VIEW.
7. Explore the journey through ROUTE TELESCOPE.
8. Keep destination observations pinned while traveling.

## Components

- **PLACE** — geocoding for human place names.
- **ROUTE** — standalone route acquisition/geometry.
- **SEEKER** — public observation discovery.
- **LIVE CORRIDOR** — route sampling and observation projection.
- **BEST VIEW** — explainable usefulness ranking.
- **ROUTE TELESCOPE** — visual journey rail.
- **WATCH** — optional ephemeral traveler progress.
- **EARTH OBSERVATION** — future weather, incidents, hazards and other public sensor layers.

## Independence

WINDOW has no dependency on Victory. No Victory code, user state, map implementation, credentials or infrastructure is required.

Other applications may integrate with WINDOW later through public contracts, but WINDOW remains independently usable and independently deployable.

## Routing provider boundary

Routing is an adapter, not the product. WINDOW should support interchangeable routing engines and preserve a normalized internal route contract:

```json
{
  "origin": {"lat": 0, "lng": 0},
  "destination": {"lat": 0, "lng": 0},
  "distanceKm": 0,
  "durationSeconds": 0,
  "points": [{"lat": 0, "lng": 0}],
  "provider": "routing-provider"
}
```

The observation engine consumes `points` and does not care which compliant routing provider produced them.
