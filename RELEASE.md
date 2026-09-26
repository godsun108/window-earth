# WINDOW Release Readiness

## Complete in repository

- [x] Truth-labelled curated public camera registry.
- [x] Place / coordinate SEEKER.
- [x] Provider-neutral observation adapters.
- [x] BEST VIEW explainable ranking.
- [x] Standalone FROM → TO routing adapter.
- [x] LIVE CORRIDOR route sampling, deduplication and projection.
- [x] Journey states: BEHIND / NOW / AHEAD / DESTINATION.
- [x] ROUTE TELESCOPE interactive journey rail.
- [x] Server-side discovery contract.
- [x] Windy Webcams server adapter.
- [x] Serverless /api/seek entry point.
- [x] Browser smoke-test page.
- [x] Curated fallback when discovery service is unavailable.
- [x] No committed provider credentials.
- [x] Explicit prohibition on private-camera probing/auth bypass.

## External blockers

- [ ] Deploy the serverless site/API.
- [ ] Configure WINDY_WEBCAMS_API_KEY in the deployment environment.
- [ ] Verify provider response shape against a real authenticated request.
- [ ] Run a real arbitrary-route camera-density test.
- [ ] Confirm provider attribution/embedding behavior in deployed UI.

## Post-provider expansion

- [ ] Add public DOT/511 adapters jurisdiction by jurisdiction.
- [ ] Add camera heading/FOV where providers expose it.
- [ ] Add ephemeral live traveler-progress input.
- [ ] Add weather/traffic/hazard observation layers.
- [ ] Production routing backend rather than relying on a public demo router.

## Release rule

Do not call credentialed global discovery complete until the authenticated provider test passes. The credential-free core is independently usable with the curated registry.
