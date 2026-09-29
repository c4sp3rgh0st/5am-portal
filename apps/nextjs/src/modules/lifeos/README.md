# 5AM LifeOS module

Native 5AM Life portal module boundary for LifeOS-derived product features.

## Rules

- The 5AM portal owns shell, routing, authentication, navigation, theme and viewport behavior.
- Do not embed the upstream LifeOS application as an iframe.
- Do not import Supabase/Auth runtime from the donor repository.
- UI is migrated feature-by-feature and adapted to 5AM Life conventions.
- Reusable domain logic belongs in `packages/lifeos-core`, not in this directory.

Upstream donor: https://github.com/lifeos-app/lifeos
5AM donor fork: https://github.com/c4sp3rgh0st/5am-lifeos

## STEP 2 shell contract

- Native route tree under `/modules/lifeos`
- 5AM session auth required
- title is `LifeOS · 5AM Life`
- shared `5am-mode` day/night preference with time-of-day fallback
- 24-hour clock without seconds
- responsive full-viewport shell with normal vertical page scrolling
- no iframe and no upstream/Homarr chrome inside the module

## STEP 3 MVP

- Today: create, complete and delete tasks
- Goals: create goals, attach tasks and show computed progress
- Shared model from `@5am/lifeos-core`
- Browser persistence under versioned key `5am-lifeos-v1`
- PostgreSQL/API migration remains a later persistence layer; UI/domain model should not need redesign
