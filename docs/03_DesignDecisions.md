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
