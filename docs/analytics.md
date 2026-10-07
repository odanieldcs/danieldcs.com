# Analytics tracking plan

Contract for PostHog on danieldcs.com: event names, properties, privacy limits, and CTA mapping.

## Privacy and runtime

- **PostHog US Cloud.** **Discard client IP data** on the project. IP is used at ingest for GeoIP and bots, not stored.
- No PostHog cookieless mode (it drops IP before transforms and breaks GeoIP/bots).
- Client: `persistence: 'memory'` — no cookies, `localStorage`, or consent banner. Uniques are inflated (new `distinct_id` per full load); pageviews and custom events stay accurate.
- Off: autocapture, session replay, surveys, feature flags.
- Init only when `NEXT_PUBLIC_VERCEL_ENV === 'production'` and the public key exists; otherwise no-op. Skip init when `navigator.webdriver === true`.
- `posthog-js` is pinned (exact version) for the same reason as the slim entry and registered extensions—upgrades are an explicit task.
- Client bootstrap: root `instrumentation-client.ts` gates first, registers delegated click tracking (`registerClickTracking` in capture phase), then lazy-loads `lib/analytics-init.ts` via `scheduleOnLoad` (`load` + `requestIdleCallback`, including when `readyState` is already `complete`; slim SDK + `historyAutocapture` + `webVitalsAutocapture` + `exceptionObserver` / `exceptions`, with bundled `posthog-js/dist/web-vitals` and `posthog-js/dist/exception-autocapture`).
- `track()` from `lib/analytics.ts`: no-op when the gate is closed (events are not queued). When the gate is open and PostHog is not loaded yet, events are queued and flushed in order on `loaded`. If init fails, the queue is discarded silently.
- `captureError()` from `lib/analytics.ts`: separate from `track()` / `AnalyticsEvent`. No-op when the gate is closed (no queue). When the gate is open and PostHog is not loaded yet, errors are queued (max 10, oldest dropped) and flushed on `loaded` via `bindErrorCapture`. If init fails, the error queue is discarded with the event queue.

**Not collected:** stored IP, page text, input values, cross-visit identity.

**Custom event properties:** identifiers only (route id, slug, language, hostname)—not full URLs or query strings. PostHog's default properties (`$current_url`, `$referrer`, browser, OS, device, screen) are kept as sent, including query strings; the privacy policy discloses this.

## Events

Names are stable `snake_case` for `track()`. One click → one event ([precedence](#precedence)).

| Event | Properties |
| --- | --- |
| `$pageview` | Super property `language` (`pt` \| `en`) from the route, not `Accept-Language` |
| `$web_vitals` | Automatic, PostHog web vitals extension — inherits super property `language` |
| `$exception` | PostHog Error Tracking — unhandled errors and unhandled promise rejections (autocapture); React route/global boundaries via `captureError()` → `captureException` with `boundary` (`route` \| `global`) and optional `digest` (Next.js). Message and stack come from PostHog; no `capture_console_errors`. |
| `article_read` | `slug`, `language` — fires once when the end of the post body enters the viewport (see below) |
| `external_link_click` | `href_host`, `source` — outbound link without `data-cta` |
| `cta_click` | `cta`, `location`, optional `target` |

`cta_click` fields: `cta` = kind below; `location` = `header` \| `footer` \| `home` \| `blog` \| `about`; `target` = nav segment, slug, or `pt` \| `en` (language switched **to**).

### `article_read`

- Fires when the sentinel after the MDX body intersects the viewport, once per post view.
- Short posts whose end is already visible on first paint fire on load; the signal means “reached the end,” not reading time.
- A full page reload sends a new event.
- `language` is the interface language for the route (same as `$pageview` super property), not `frontmatter.language`.

### Errors

- **Autocapture:** `window.onerror` and unhandled promise rejections when production analytics is enabled. Console errors are off. The autocapture script is bundled (`posthog-js/dist/exception-autocapture`); the browser should not fetch PostHog CDN chunks for it.
- **Boundaries:** `app/(pt)/error.tsx`, `app/(en)/en/error.tsx`, and `app/global-error.tsx` call `captureError()` once per boundary render (React render errors are not double-counted with autocapture in normal cases).
- **Dashboard:** PostHog **Error tracking** for `$exception` grouping and trends.
- **Limits:** Client stacks are minified; no source maps in V1. SSG/build failures and server-only errors appear in Vercel logs, not PostHog.

### Web Vitals

- PostHog’s web vitals extension sends `$web_vitals` with LCP, CLS, FCP, and INP (not TTFB). Attribution is off (`web_vitals_attribution: false`); the `web-vitals` script is bundled via `posthog-js/dist/web-vitals` (no CDN fetch).
- In PostHog: **Web analytics → Web vitals**. Good thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, FCP ≤ 1.8 s.
- Metrics reflect the **initial load** of each page, not client-side navigations. CLS and INP are flushed when the page is hidden or closed, so abrupt exits may drop samples.

## CTA catalog

Mobile header nav uses the same values as desktop.

| Where | UI | Event | `cta` / other |
| --- | --- | --- | --- |
| Header | Blog, Community, About | `cta_click` | `nav_item`, `target`: `blog` \| `community` \| `about` |
| Footer | PT posts `blog/livros-recomendados`, `blog/ferramentas-apps-e-setup`; Privacy | `cta_click` | `nav_item`, `target`: path id or `privacy` |
| Footer | LinkedIn, GitHub, YouTube, Instagram | `external_link_click` | `source: footer`, `href_host` |
| Home | About link; post cards | `cta_click` | `home_about`; or `post_card` + `target` slug |
| Blog | Post cards (list/grid) | `cta_click` | `post_card`, `target`: slug |
| About | LinkedIn trajectory; `mailto` contact | `cta_click` | `linkedin_experience`; `contact_email` |
| Header | Language switch | `cta_click` | `language_switch`, `target`: `pt` \| `en` |

## Precedence

1. `data-cta` on element or ancestor → `cta_click` only.
2. Else external link → `external_link_click` only.

## DOM attributes

Mark interactive elements in the UI; the delegated listener in `lib/analytics-click.ts` reads them at click time.

- **`data-cta`**, **`data-cta-location`**, optional **`data-cta-target`** — map to `cta_click` (`cta`, `location`, `target`). Invalid `data-cta` / `data-cta-location` values are ignored (no event).
- **`data-analytics-source`** on an ancestor — `LinkSource` for `external_link_click` (`post`, `footer`, `about`, `community`). Missing or invalid → `unknown`.
- **Middle-click** (`auxclick`) does not fire `click`; no custom event is sent.
- Listener uses capture phase, is registered only when the analytics gate is open, and runs before PostHog lazy-load; early clicks still queue via `track()`.

## Deferred

- `article_view` (redundant with `$pageview` on `/blog/*`)
- Trilha, `/alunos` (`noindex` / interim)

## New events

Document name and properties here first. Stable `snake_case`; identifiers only; one click, one event.
