// Everything about the player's current run through the subway system.
// GameState owns exactly one of these. UI code should read from it and
// call methods on GameState to change it, rather than mutating fields
// directly from arbitrary places.

export const Difficulty = Object.freeze({
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
});

export class PlayerState {
	constructor({
		currentStation,
		timeElapsedMinutes,
		money,
		charliecardBalance,
		hunger,
		difficulty,
		scoreMultiplier,
	}) {
		this.currentStation = currentStation;
		this.timeElapsedMinutes = timeElapsedMinutes;
		this.money = money;
		this.charliecardBalance = charliecardBalance;
		this.hunger = hunger;
		this.difficulty = difficulty;
		this.scoreMultiplier = scoreMultiplier;
	}
}
