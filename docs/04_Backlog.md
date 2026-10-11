# Backlog / Open Questions

Ideas and design gaps that are explicitly deferred, so they get raised
and approved at the right phase instead of sneaking in early.

## Needs design before implementation

- **Downtown Crossing concourse challenge** (Orange Line finale, GDD
  §7.3). Inspired by the Kansas River crossing in Oregon Trail. Mechanics
  not yet designed — must be discussed and approved before Phase 3/5
  Orange Line work.
- **Hunger thresholds and penalties** (GDD §10.4). Low-hunger effects
  (beyond "it can't go below 0") aren't designed yet — no starvation
  consequence, no low-hunger warning. The decay rate itself is a rough
  placeholder (`HUNGER_DECAY_PER_MINUTE = 1` in `game-state.js`) pending
  a real balancing pass.
- **Scoring formula** (GDD §15). How elapsed time, money, CharlieCard
  balance, difficulty multiplier, and achievements combine into a final
  score.
- **CharlieCard balancing values** (GDD §10.3): starting balances per
  archetype are in place (placeholders - see `03_DesignDecisions.md`),
  and Ride Train now spends a flat `RIDE_FARE = $2.40` per hop
  regardless of line. No way to top up CharlieCard balance exists yet.
- **Event JSON schema** (GDD §13): exact field names/types for event
  data files, finalized when Phase 3 (random events) begins.
- **Food prices/hunger values** (GDD §11): placeholder numbers are in
  `data/food/food.json` now (Phase 3), but not balance-tested.

## Deferred from Phase 3 (picking up again once there's a reason to)

- **Rest and Wait actions** (GDD §9): not built yet. Both are simple
  (just pass time), but weren't worth their own slice before the turn
  menu exists to hold them.
- **Full turn menu** (GDD §9): the player currently sees every action
  as an always-visible button rather than choosing one action per turn
  from a menu. Deferred until Rest/Wait exist too, so the menu has
  something real to switch between.
- **CharlieCard cost on Ride Train**: done - see
  `03_DesignDecisions.md`. What's still open: there's no way to top up
  CharlieCard balance or earn more cash beyond Hunt for Food, so a
  player who depletes both is stuck with Ride Train permanently
  disabled and no lose-condition screen to tell them the run is over.
  That's intentional per GDD §16 ("being unable to ride because
  transportation funds are depleted") but incomplete until Game Over
  exists.

## Future features (not Version 1)

- Additional MBTA lines beyond Red/Green/Orange.
- Achievements system details.
- Save/load format.
- Audio and pixel art asset production.
