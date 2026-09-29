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
