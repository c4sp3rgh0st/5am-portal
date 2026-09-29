# 5AM Portal Engine

5AM Portal is a fork of Homarr used as the application shell for 5AM Life.

## Keep from Homarr
- Auth, users, groups, permissions
- Dashboard grid and widget engine
- App registry, search, realtime, integrations, settings

## 5AM layer
- Design system and navigation
- Sunrise / time-of-day procedural UI
- Module registry
- Notifications and command palette
- Agent surface

## Module contract
Every major 5AM project is registered as a module with:
- stable module ID
- route
- navigation group
- auth requirement
- optional backend health endpoint

Trading Lab is the first module. Its backend remains independent at
/opt/5am-trading and the portal consumes it rather than duplicating it.

Homarr-specific homelab tooling will be retained only where useful and
progressively moved under the OPS surface.

## Trading Lab internal surfaces

Trading Lab is a 5AM Portal module under MONEY. Its internal surfaces are:

- Wallet Radar — live watched-wallet activity
- Wallet Scout — discovery, evidence synthesis and validation
- Signals — scored market opportunities
- Paper — simulated execution
- Risk — independent controls and telemetry

Wallet Scout is not a separate application. It is an intelligence layer inside
Trading Lab. Provider adapters remain replaceable. Helius is the on-chain
verification source; Nansen, GMGN and Birdeye are discovery inputs; OpenRouter
is the reasoning layer when configured.

The portal consumes Trading Lab through its localhost API and never owns
trading execution or wallet credentials.

### Wallet Scout cost policy

Wallet Scout uses a strict free-first inference policy:

1. `openrouter/free`
2. `deepseek/deepseek-v4-flash-0731`
3. `z-ai/glm-5.3-flash`

Paid fallback is bounded by a daily USD budget and per-million-token price ceilings.
No premium model is permitted outside the configured ceiling without an explicit
configuration change. Model usage is recorded in `wallet_scout_usage` and surfaced
inside the Trading Lab Wallet Scout panel.
