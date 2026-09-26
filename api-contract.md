# WINDOW Discovery Service Contract

The static client calls:

`GET /api/seek?lat={latitude}&lng={longitude}`

The service may fan out to credentialed, intentionally-public camera catalogs. Provider credentials must remain server-side.

## Response

```json
{
  "query": {"lat": 0, "lng": 0},
  "generated_at": "ISO-8601",
  "providers": [{"id":"provider","ok":true,"count":0}],
  "cameras": [{
    "id": "provider:camera-id",
    "place": "Camera label",
    "lat": 0,
    "lng": 0,
    "status": "LIVE",
    "provider": "Provider",
    "type": "iframe",
    "embed": "https://public-media-or-player",
    "source": "https://public-source-page",
    "heading": null,
    "fov": null,
    "freshnessSeconds": null,
    "rights": "SOURCE TERMS APPLY"
  }]
}
```

## Rules

- Only intentionally public camera catalogs and feeds.
- No IP-range scanning, guessed private endpoints, default credentials, or auth bypass.
- Do not expose provider API keys to the browser.
- Do not relabel snapshots as LIVE.
- Preserve provider/source provenance and rights metadata.
- Cache provider responses where permitted.
- Provider failure is isolated: one failed adapter must not fail the whole seek.
- Deduplicate before ranking when multiple catalogs describe the same physical camera.
- Expiring media URLs are returned only within their permitted lifetime.

## Planned server adapters

1. Windy Webcams v3 — global geographic discovery; keyed API.
2. Public 511/DOT camera APIs — regional traffic-camera discovery; credentials/terms vary by jurisdiction.
3. Government parks, observatories, weather and other intentionally public camera catalogs where a stable programmatic source exists.
