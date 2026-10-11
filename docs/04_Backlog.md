# Backlog / Open Questions

Ideas and design gaps that are explicitly deferred, so they get raised
and approved at the right phase instead of sneaking in early.

## Needs design before implementation

- **Downtown Crossing concourse challenge** (Orange Line finale, GDD
  §7.3). Inspired by the Kansas River crossing in Oregon Trail. Mechanics
  not yet designed — must be discussed and approved before Orange Line
  content is considered complete.
- **Hunger thresholds and penalties beyond starvation** (GDD §10.4).
  The hunger-reaches-zero loss condition exists now (see
  `03_DesignDecisions.md`), but there's no graduated low-hunger
  warning or penalty before that point — it's a cliff, not a slope.
  The decay rate itself (`HUNGER_DECAY_PER_MINUTE = 1`) is still a
  rough placeholder pending a real balancing pass.
- **Scoring formula isn't finalized** — a placeholder formula exists
  now (see `03_DesignDecisions.md`), with arbitrary weights for time,
  money, and CharlieCard balance. Achievements aren't factored in at
  all yet (no achievement system exists).
- **CharlieCard balancing values** (GDD §10.3): starting balances per
  archetype and the flat `RIDE_FARE = $2.40` are in place (placeholders
  — see `03_DesignDecisions.md`). No way to top up CharlieCard balance
  exists yet.
- **Event JSON schema** (GDD §13): the full Random Events system
  (signal problems, delays, mechanical failures) isn't built at all.
  Hunt for Food's minigame covers food-specific randomness only (GDD
  §12); GDD §13's broader, route-wide event system is still untouched.
- **Food prices/hunger values** (GDD §11): placeholder numbers are in
  `data/food/food.json`, not balance-tested.

## Known gaps in the closed loop

- **No CharlieCard top-up action.** A player who depletes both cash
  and CharlieCard balance gets stuck (Ride Train disabled) until they
  starve or the Game Over screen catches it via `isStranded`. That's
  the intended lose condition (GDD §16), but there's no way to recover
  by, say, finding more cash — only Hunt for Food exists as a free
  income source, and it produces hunger, not money.
- **No graduated hunger warning.** Hunger hits 0 and the run ends;
  there's no "getting hungry" signal beforehand beyond watching the
  number.
- **Full turn menu** (GDD §9) is implemented as "all 5 actions visible
  as buttons," not a literal single-choice-per-turn menu widget. See
  `03_DesignDecisions.md` for the reasoning. Revisit if a future
  feature (e.g. a proper event screen) needs the player's choices
  deliberately narrowed for a moment.

## Future features (not Version 1)

- Additional MBTA lines beyond Red/Green/Orange.
- Achievements system details.
- Save/load format.
- Audio and pixel art asset production.
- A graduated hunger-penalty curve instead of a hard 0-or-fine cliff.
