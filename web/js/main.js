import { GameState } from "./state/game-state.js";

// Phase 2 screen: shows the player's current station and lets them
// ride the train forward one stop at a time until Park Street. No
// money/hunger effects yet, and no other actions - those arrive once
// Phase 3 gives them something real to do.

function refreshDisplay() {
	const player = GameState.player;

	document.getElementById("station").textContent =
		`Station: ${GameState.currentStation.name}`;
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

	const rideButton = document.getElementById("ride-button");
	const resultLabel = document.getElementById("result");
	if (GameState.hasArrived) {
		rideButton.disabled = true;
		resultLabel.textContent = "You have reached Park Street.";
	} else {
		rideButton.disabled = false;
		resultLabel.textContent = "";
	}
}

async function main() {
	await GameState.loadRedLine();
	refreshDisplay();

	document.getElementById("ride-button").addEventListener("click", () => {
		GameState.rideTrain();
		refreshDisplay();
	});
}

main();
