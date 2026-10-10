import { GameState } from "./state/game-state.js";

// Phase 1 proof-of-architecture screen: displays whatever is currently
// sitting in GameState. No gameplay yet - Phase 2 replaces this with
// the real station/turn screen.

function refreshDisplay() {
	const player = GameState.player;

	document.getElementById("station").textContent =
		`Station: ${player.currentStation}`;
	document.getElementById("time").textContent =
		`Time elapsed: ${player.timeElapsedMinutes} min`;
	document.getElementById("money").textContent =
		`Money: $${player.money.toFixed(2)}`;
	document.getElementById("charliecard").textContent =
		`CharlieCard balance: $${player.charliecardBalance.toFixed(2)}`;
	document.getElementById("hunger").textContent =
		`Hunger: ${player.hunger}`;
	document.getElementById("difficulty").textContent =
		`Difficulty: ${player.difficulty}`;
	document.getElementById("multiplier").textContent =
		`Score multiplier: ${player.scoreMultiplier.toFixed(1)}x`;
}

refreshDisplay();
