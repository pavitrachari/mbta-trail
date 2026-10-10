import { PlayerState, Difficulty } from "./player-state.js";

// Global source of truth for the current run's state.
// Because ES modules are evaluated once and cached, every file that
// imports GameState gets this exact same object - no registration
// step needed (unlike Godot's autoload singletons).

// Placeholder Easy-mode defaults, just to prove the architecture works.
// Real archetype selection (Phase 2/3) will replace this with values
// loaded from data/archetypes/.
export const GameState = {
	player: new PlayerState({
		currentStation: "Alewife",
		timeElapsedMinutes: 0,
		money: 40.0,
		charliecardBalance: 10.0,
		hunger: 100,
		difficulty: Difficulty.EASY,
		scoreMultiplier: 1.0,
	}),
};
