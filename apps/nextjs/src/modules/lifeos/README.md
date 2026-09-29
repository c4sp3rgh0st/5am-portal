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
