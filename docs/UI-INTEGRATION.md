# Oddmash UI integration

The inspector uses Button for panel actions and Field, Select, and Switch for timeline filters. Shared CSS is adopted inside the existing closed Shadow DOM. Panel dimensions, the dark palette, and timeline layout belong to the extension. The package is pinned to an exact npm version in `package.json` and `pnpm-lock.yaml`.

The initial Button migration matched the previous panel screenshot in its Chromium fixture. That result describes the original migration. Later work added the shared filter controls and their keyboard coverage.

Keep the permission boundary and privacy behavior in [the working agreements](../AGENTS.md) when adopting shared UI. Before adding a portalled overlay, verify that its portal stays inside the inspector's shadow root and that keyboard focus returns to the trigger after dismissal.

See [the contributor guide](../CONTRIBUTING.md) for token generation, dependency updates, build steps, and extension verification.

[Initial integration](https://github.com/Oddmash/interaction-inspector/pull/5) · [npm dependency](https://github.com/Oddmash/interaction-inspector/pull/6) · [Timeline filter controls](https://github.com/Oddmash/interaction-inspector/pull/7)
