# Analytics tracking plan

Contract for PostHog on danieldcs.com: event names, properties, privacy limits, and CTA mapping.

## Privacy and runtime

- **PostHog US Cloud.** **Discard client IP data** on the project. IP is used at ingest for GeoIP and bots, not stored.
- No PostHog cookieless mode (it drops IP before transforms and breaks GeoIP/bots).
- Client: `persistence: 'memory'` — no cookies, `localStorage`, or consent banner. Uniques are inflated (new `distinct_id` per full load); pageviews and custom events stay accurate.
- Off: autocapture, session replay, surveys, feature flags.
- Init only when `NEXT_PUBLIC_VERCEL_ENV === 'production'` and the public key exists; otherwise no-op. Skip init when `navigator.webdriver === true`.

**Not collected:** stored IP, page text, input values, cross-visit identity.

**Properties:** identifiers only (route id, slug, language, hostname)—not full URLs or query strings.

## Events

Names are stable `snake_case` for `track()`. One click → one event ([precedence](#precedence)).

| Event | Properties |
| --- | --- |
| `$pageview` | Super property `language` (`pt` \| `en`) from the route, not `Accept-Language` |
| `article_read` | `slug`, `language` — read-complete threshold on a post |
| `external_link_click` | `href_host`, `source` — outbound link without `data-cta` |
| `cta_click` | `cta`, `location`, optional `target` |

`cta_click` fields: `cta` = kind below; `location` = `header` \| `footer` \| `home` \| `blog` \| `about`; `target` = nav segment, slug, or `pt` \| `en` (language switched **to**).

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

## Deferred

- `article_view` (redundant with `$pageview` on `/blog/*`)
- Trilha, `/alunos` (`noindex` / interim)

## New events

Document name and properties here first. Stable `snake_case`; identifiers only; one click, one event.
