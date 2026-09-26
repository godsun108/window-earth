# WINDOW LIVE CORRIDOR

**Promise:** See where you're going before you get there.

WINDOW does not need Victory's private mapping implementation. A route provider hands WINDOW an ordered polyline:

```js
[
  { "lat": 27.0, "lng": -80.0 },
  { "lat": 27.1, "lng": -80.1 }
]
```

Then:

```js
await WINDOW_ROUTE.watchRoute(points, {
  spacingKm: 20,
  corridorKm: 10
})
```

returns:

- total route distance
- number of observation search samples
- discovered candidate count
- `eyes[]` ordered by progress along the route
- each eye's approximate `routeKm` and distance from the route corridor

## Runtime model

1. Sample the route at bounded intervals.
2. Ask WINDOW adapters for intentionally-public observations near each sample.
3. Deduplicate cameras discovered from overlapping searches.
4. Project each camera onto the nearest sampled route position.
5. Reject cameras outside the corridor.
6. Order remaining eyes from origin to destination.
7. Later: combine this geometry with BEST VIEW, heading/FOV, freshness and current traveler progress.

## Privacy boundary

Victory may keep routing, user state and proprietary map logic private. WINDOW only needs the route geometry explicitly handed to it. WINDOW does not require private Victory source code or persistent traveler location.

## Next milestones

- Route input UI / demo route.
- Merge BEST VIEW scoring into each corridor segment.
- Traveler progress input so cameras behind the traveler fall away.
- Pin destination eyes.
- View-cone geometry when heading/FOV are known.
- Traffic/weather/EARTH NOW observations alongside camera eyes.
