import { GameState } from "./state/game-state.js";
import { runHuntMinigame } from "./hunt-minigame.js";

// Full loop: Main Menu -> Character Select -> Game -> Victory/Game Over
// -> back to Character Select. The Downtown Crossing finale still
// doesn't exist yet - see docs/04_Backlog.md. "Full turn menu" (GDD
// Section 9) is interpreted here as "all 5 actions exist and work,"
// not a literal single-choice menu widget - see
// docs/03_DesignDecisions.md for why.

const BULLET_COUNT = 6;

function showScreen(screenId) {
	for (const section of document.querySelectorAll("#screen > section")) {
		section.hidden = section.id !== screenId;
	}
}

function buildArchetypeList() {
	const list = document.getElementById("archetype-list");
	for (const archetype of GameState.archetypes) {
		const card = document.createElement("div");
		card.className = "archetype-card";

		const title = document.createElement("h3");
		title.textContent = `${archetype.name} (${archetype.difficulty})`;

		const flavor = document.createElement("p");
		flavor.className = "flavor-text";
		flavor.textContent = archetype.flavorText;

		const chooseButton = document.createElement("button");
		chooseButton.textContent = "Choose";
		chooseButton.addEventListener("click", () => startRun(archetype.id));

		card.append(title, flavor, chooseButton);
		list.append(card);
	}
}

function resetMessages() {
	for (const id of ["ride-message", "rest-wait-message", "hunt-message", "food-message"]) {
		document.getElementById(id).textContent = "";
	}
}

async function startRun(archetypeId) {
	await GameState.selectArchetype(archetypeId);
	await GameState.loadFoodMenu();
	await GameState.loadHuntMenu();
	buildFoodMenu();
	resetMessages();
	refreshDisplay();
	showScreen("game-screen");
}

function buildFoodMenu() {
	const menu = document.getElementById("food-menu");
	menu.replaceChildren(); // clear out the previous run's rows, if any
	for (const food of GameState.foodItems) {
		const row = document.createElement("div");
		row.className = "food-item";

		const label = document.createElement("span");
		label.textContent = `${food.name} — $${food.price.toFixed(2)} (+${food.hungerRestored} hunger)`;

		const flavor = document.createElement("p");
		flavor.className = "flavor-text";
		flavor.textContent = food.flavorText;

		const buyButton = document.createElement("button");
		buyButton.textContent = "Buy";
		buyButton.dataset.foodId = food.id;
		buyButton.dataset.price = food.price;
		buyButton.addEventListener("click", () => {
			const bought = GameState.buyFood(food.id);
			document.getElementById("food-message").textContent = bought
				? `Bought a ${bought.name}.`
				: "Can't afford that.";
			handleTurnOutcome();
		});

		row.append(label, flavor, buyButton);
		menu.append(row);
	}
}

// Disables every action button during the hunt, so other actions
// can't interleave with an in-progress hunt. refreshDisplay() restores
// the correct enabled/disabled state once the hunt is over.
function disableAllActionsDuringHunt() {
	for (const id of ["ride-button", "hunt-button", "rest-button", "wait-button"]) {
		document.getElementById(id).disabled = true;
	}
	for (const buyButton of document.querySelectorAll("#food-menu button")) {
		buyButton.disabled = true;
	}
}

function refreshDisplay() {
	const player = GameState.player;

	document.getElementById("station").textContent =
		`Station: ${GameState.currentStation.name}`;
	document.getElementById("time").textContent =
		`Time elapsed: ${player.timeElapsedMinutes} min`;
	document.getElementById("money").textContent =
		`Money: $${player.money.toFixed(2)}`;
	document.getElementById("charliecard").textContent = Number.isFinite(player.charliecardBalance)
		? `CharlieCard balance: $${player.charliecardBalance.toFixed(2)}`
		: "CharlieCard balance: Unlimited";
	document.getElementById("hunger").textContent =
		`Hunger: ${player.hunger}`;
	document.getElementById("difficulty").textContent =
		`Difficulty: ${player.difficulty}`;
	document.getElementById("multiplier").textContent =
		`Score multiplier: ${player.scoreMultiplier.toFixed(1)}x`;

	document.getElementById("ride-button").disabled = GameState.hasArrived || !GameState.canAffordRide;
	document.getElementById("hunt-button").disabled = GameState.hasArrived;
	document.getElementById("rest-button").disabled = GameState.hasArrived;
	document.getElementById("wait-button").disabled = GameState.hasArrived;

	for (const buyButton of document.querySelectorAll("#food-menu button")) {
		buyButton.disabled = GameState.hasArrived || player.money < Number(buyButton.dataset.price);
	}
}

function showVictoryScreen() {
	const player = GameState.player;
	document.getElementById("victory-time").textContent =
		`Time elapsed: ${player.timeElapsedMinutes} min`;
	document.getElementById("victory-money").textContent =
		`Money remaining: $${player.money.toFixed(2)}`;
	document.getElementById("victory-charliecard").textContent = Number.isFinite(player.charliecardBalance)
		? `CharlieCard balance: $${player.charliecardBalance.toFixed(2)}`
		: "CharlieCard balance: Unlimited";
	document.getElementById("victory-score").textContent =
		`Score: ${GameState.calculateScore()} pts`;
	showScreen("victory-screen");
}

function showGameOverScreen() {
	document.getElementById("game-over-reason").textContent = GameState.hasStarved
		? "You collapsed from hunger before reaching Park Street."
		: "Your CharlieCard is empty and so is your wallet. Stranded, with no way to pay the fare.";
	showScreen("game-over-screen");
}

// Call after every action resolves: refreshes the stats, then checks
// whether that action ended the run (reaching Park Street always wins,
// even if hunger also happened to hit zero on the same move).
function handleTurnOutcome() {
	refreshDisplay();
	if (GameState.hasArrived) {
		showVictoryScreen();
	} else if (GameState.isGameOver) {
		showGameOverScreen();
	}
}

async function main() {
	await GameState.loadArchetypes();
	buildArchetypeList();

	document.getElementById("start-button").addEventListener("click", () => {
		showScreen("character-select-screen");
	});

	document.getElementById("play-again-button").addEventListener("click", () => {
		showScreen("character-select-screen");
	});
	document.getElementById("try-again-button").addEventListener("click", () => {
		showScreen("character-select-screen");
	});

	document.getElementById("ride-button").addEventListener("click", () => {
		const rode = GameState.rideTrain();
		document.getElementById("ride-message").textContent = rode
			? ""
			: "Not enough money or CharlieCard balance to pay the fare.";
		handleTurnOutcome();
	});

	document.getElementById("rest-button").addEventListener("click", () => {
		GameState.rest();
		document.getElementById("rest-wait-message").textContent = "You rest for a bit.";
		handleTurnOutcome();
	});

	document.getElementById("wait-button").addEventListener("click", () => {
		GameState.wait();
		document.getElementById("rest-wait-message").textContent = "You wait.";
		handleTurnOutcome();
	});

	document.getElementById("hunt-button").addEventListener("click", async () => {
		disableAllActionsDuringHunt();
		const arena = document.getElementById("hunt-arena");
		const statusLabel = document.getElementById("hunt-status");
		document.getElementById("hunt-game").hidden = false;
		document.getElementById("hunt-message").textContent = "";

		const candidateFoods = GameState.pickHuntRoundFoods();
		const caught = await runHuntMinigame(arena, candidateFoods, BULLET_COUNT, (remaining) => {
			statusLabel.textContent = `Bullets left: ${remaining}`;
		});
		const hungerGained = GameState.applyHuntResults(caught);

		document.getElementById("hunt-game").hidden = true;
		statusLabel.textContent = "";
		document.getElementById("hunt-message").textContent = caught.length > 0
			? `Shot down ${caught.length}/${candidateFoods.length}: ${caught.map((food) => food.name).join(", ")}. (+${hungerGained} hunger)`
			: `Didn't hit anything this time (0/${candidateFoods.length}).`;

		handleTurnOutcome();
	});
}

main();
