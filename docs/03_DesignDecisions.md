# Design Decisions Log

Minor implementation decisions made along the way that don't change
gameplay but are worth recording so we don't relitigate them later.

## Phase 1 — Project Setup

**Platform (superseding an earlier choice):** Phase 1 was first built as
a Godot 4 project. We reconsidered and switched to a plain static web
page (HTML/CSS/vanilla JS, no build step) because the game is entirely
text/UI-driven with no need for an engine's rendering, physics, or scene
editor — and a browser page is simpler to test (open a file, no editor
install) and to share (a URL, not an export build), which fits the
"keep it as simple as Oregon Trail" goal better. The architecture
decisions below (single state owner, data-driven JSON) are unchanged;
only the implementation language/platform changed.

**State architecture:** A single module-level object, `GameState`
(`web/js/state/game-state.js`), owns one `PlayerState` object for the
current run. Because ES modules are singletons by default (evaluated
once, cached, same object returned to every importer), this needs no
special registration — unlike Godot, which required an explicit
`[autoload]` entry for the same effect. UI code reads from
`GameState.player` and will call methods on `GameState`/`PlayerState` to
change it, never mutating it by reaching into unrelated UI code. This
keeps gameplay logic out of the UI layer per the GDD's technical
priorities (Section 18).

**Data format:** JSON files, loaded with `fetch()`, per GDD Section 19.
Not introduced until Phase 2, since Phase 1 has no station/route/event
content yet.

**Docs restructuring:** Split the original single `GameDesignDocument`
file into `01_GameDesignDocument.md` (pure design, sections renumbered
1–21) and `AI_DevelopmentPrompt.md` (process/collaboration rules). This
matches the project structure in GDD Section 20 and keeps design and
process concerns from bleeding into each other.

## Phase 2 — Core Gameplay (movement)

**Scope cut:** Implemented only the "Ride Train" action and real
station/route data this phase, not the full 5-action turn menu (GDD
Section 9). Buy Food / Hunt / Rest / Wait don't do anything meaningful
until Phase 3 gives them money/hunger effects, so a menu with four dead
buttons wouldn't have taught us anything. The turn menu itself arrives
alongside those actions.

**Route/station JSON schema:** `data/routes/<line>.json` holds `id`,
`name`, an ordered `stationIds` array, and a single `rideMinutes` value
applied to every hop on that route. `data/stations/<line>.json` is an
array of `{ id, name }`. One ride-time constant per route (not per leg)
is the simplest possible knob; it can be split into per-leg costs later
if a specific stretch (e.g. the Downtown Crossing finale) needs its own
number. Station flavor text, food/hunting opportunities, and
station-specific events (GDD Section 14) are deliberately not in this
schema yet — they're a Phase 5 content pass, and adding empty
placeholder fields now would be speculative.

**Serving directory:** `data/` lives outside `web/` (see GDD Section
20's project structure), and `fetch()` paths in `game-state.js` are
`../data/...`, relative to the page. That means the local dev server
must be started from the **repository root**, not from inside `web/` -
otherwise the server can't see anything above its own root and the
fetch 404s. See README.md for the exact command.

## Phase 3 — Gameplay Systems (hunger + food)

**Scope cut:** This slice is hunger decay and "Buy Food" only - not
CharlieCard cost on Ride Train, not Hunt/Rest/Wait, not random events.
Hunger decay and food restoration are bundled together deliberately:
neither is a meaningful decision without the other (GDD Section 5.4 /
10.4).

**Centralized time advancement:** Added `GameState.advanceTime(minutes)`
as the single place that bumps `timeElapsedMinutes` and decays hunger.
`rideTrain()` and `buyFood()` both go through it rather than duplicating
the decay math, so Rest/Wait/Hunt get correct hunger decay for free when
they're added later.

**Placeholder balancing constants:** `HUNGER_DECAY_PER_MINUTE = 1` and
`BUY_FOOD_MINUTES = 3`, hardcoded in `game-state.js` rather than put in a
data file. GDD Section 19 wants balancing values data-driven eventually,
but there's only one of each constant right now and no actual need to
rebalance them independently yet - introducing a config-loading system
for two numbers would be premature. Revisit when the real balancing
pass happens (see `04_Backlog.md`).

**Food data:** `data/food/food.json` holds the GDD's starter items
(Section 11) as a single shared list - not per-line or per-station yet.
Station-specific food opportunities (GDD Section 14) are a Phase 5
content concern, not Phase 3 plumbing.

**CharlieCard cost deferred:** Skipped CharlieCard spending on Ride
Train this phase even though it was originally planned next. The
prototype is hardcoded to the Easy archetype (unlimited pass, so nothing
would visibly change), and there's no difficulty/archetype selection
screen yet - that's Phase 4 Interface work. Revisit CharlieCard cost
once archetype selection exists, so it's actually observable.

**Hunt for Food:** Added `data/food/hunt_outcomes.json` (a list of
`{ id, flavorText, hungerRestored, weight }`) and a small standalone
`pickWeighted()` utility (`web/js/util/weighted-random.js`), rather than
building the full Random Events system from GDD Section 13 (signal
problems, delays, mechanical failures - a much bigger, route-wide
system planned for its own phase). Hunting is specifically about food
opportunities per Section 12, so it gets its own small, separate data
file instead of overloading the general event schema prematurely.
`HUNT_MINUTES = 5` is another placeholder balancing constant, same
caveat as the others above.
