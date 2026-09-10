# Design Decisions Log

Minor implementation decisions made along the way that don't change
gameplay but are worth recording so we don't relitigate them later.

## Phase 1 — Project Setup

**Engine version:** Godot 4.3 (stable). No specific 4.x feature is
required beyond what any recent 4.x release supports; pin to 4.3 for
consistency across sessions.

**Renderer:** GL Compatibility (`gl_compatibility`). Matches the retro,
low-fidelity presentation goal and runs on the widest range of hardware,
including older/lower-power machines — appropriate for a text-and-pixel-art
game with no need for advanced 3D rendering features.

**State architecture:** A single autoloaded singleton, `GameState`, owns
one `PlayerState` object for the current run. UI scenes read from
`GameState.player` and call methods on `GameState`/`PlayerState` to
change it; they never mutate resources by reaching into other UI nodes.
This keeps gameplay logic out of the UI layer per the GDD's technical
priorities (Section 18).

**Data format:** JSON files, parsed by a small loader utility, per GDD
Section 19. Not introduced until Phase 2, since Phase 1 has no station/
route/event content yet.

**Docs restructuring:** Split the original single `GameDesignDocument`
file into `01_GameDesignDocument.md` (pure design, sections renumbered
1–21) and `AI_DevelopmentPrompt.md` (process/collaboration rules). This
matches the project structure in GDD Section 20 and keeps design and
process concerns from bleeding into each other.
