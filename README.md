# Network Detective v4 — NOC Simulator Edition

A standalone static site adapted from the supplied ArkayNMS Find the Fault dashboard.

## Features
- 13-node SVG topology with clickable links, simulated interface telemetry and incident timeline
- 20 scenario definitions; Fisher–Yates shuffle chooses 5 unique incidents each run
- 90-second timer per incident, 2 incorrect repair limit, success confetti and critical failure dialogs
- Shared top-50 scoreboard on Supabase, auto-refreshing every 15 seconds; local fallback
- iPad display at `/?mode=display`

## Setup
1. Run `supabase.sql` in your Supabase project's SQL Editor (only if you have not already run the v3 schema).
2. Edit `config.js` with the **public** project URL and publishable/anon key. Never use the service-role or secret key.
3. Upload `index.html`, `config.js`, `leaderboard.js` to your existing static hosting repository root. Replace old v3 files. You do not need old `game.js` or `styles.css` because v4's dashboard HTML contains the game styles and game logic.
4. Deploy via Cloudflare Pages or another compatible static host.
5. Test a full 5-incident run on two devices and confirm both scores in Supabase Table Editor and `/?mode=display`.

## Caveats
- Casual booth demo only: client-calculated scores can be forged. For prizes, use a trusted server/API for score validation and rate limiting.
- Scenarios simulate network incidents; this is not connected to live ArkayNMS or actual equipment.
- The supplied original design has a fixed network graph. All 20 scenarios use its existing links and nodes, rather than generating new physical topology layouts.
- The public Supabase insert policy permits untrusted visitors to submit scores. If your event requires moderation, disable public writes and use an authenticated backend.
- Free Supabase projects can pause when idle; check shortly before the summit.
