# @5am/lifeos-core

Framework-independent LifeOS domain package for 5AM Life.

This package is intentionally empty at STEP 1. Logic is migrated from the donor fork in small reviewed slices instead of merging the upstream application into the Homarr-based portal.

## Allowed

- domain types and schemas
- recurrence, goal, habit and review engines
- deterministic calculations and validators
- framework-independent helpers

## Not allowed

- React components
- Supabase client/auth imports
- portal routing or Homarr shell code
- direct database/network access

When donor-derived code is introduced, preserve applicable upstream license notices and record the upstream source path/commit in the migration commit or PR.
