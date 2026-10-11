import { GameState } from "./state/game-state.js";
import { runHuntMinigame } from "./hunt-minigame.js";

// Phase 4 screen flow: Main Menu -> Character Select -> Game. Rest/Wait,
// the full turn menu, and the Downtown Crossing finale still don't
// exist yet - see docs/04_Backlog.md.

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

async function startRun(archetypeId) {
	await GameState.selectArchetype(archetypeId);
	await GameState.loadFoodMenu();
	await GameState.loadHuntMenu();
	buildFoodMenu();
	refreshDisplay();
	showScreen("game-screen");
}

function buildFoodMenu() {
	const menu = document.getElementById("food-menu");
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
			refreshDisplay();
		});

		row.append(label, flavor, buyButton);
		menu.append(row);
	}
}

// Disables every action button during the hunt, so riding the train
// or buying food can't interleave with an in-progress hunt.
// refreshDisplay() restores the correct enabled/disabled state once
// the hunt is over.
function disableAllActionsDuringHunt() {
	document.getElementById("ride-button").disabled = true;
	document.getElementById("hunt-button").disabled = true;
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

	document.getElementById("result").textContent =
		GameState.hasArrived ? "You have reached Park Street." : "";

	document.getElementById("ride-button").disabled = GameState.hasArrived || !GameState.canAffordRide;
	document.getElementById("hunt-button").disabled = GameState.hasArrived;

	for (const buyButton of document.querySelectorAll("#food-menu button")) {
		buyButton.disabled = GameState.hasArrived || player.money < Number(buyButton.dataset.price);
	}
}

async function main() {
	await GameState.loadArchetypes();
	buildArchetypeList();

	document.getElementById("start-button").addEventListener("click", () => {
		showScreen("character-select-screen");
	});

	document.getElementById("ride-button").addEventListener("click", () => {
		const rode = GameState.rideTrain();
		document.getElementById("ride-message").textContent = rode
			? ""
			: "Not enough money or CharlieCard balance to pay the fare.";
		refreshDisplay();
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

		refreshDisplay();
	});
}

main();
