import { GameState } from "./state/game-state.js";
import { runHuntMinigame } from "./hunt-minigame.js";

// Phase 3 screen: adds hunger decay, a food menu, and the Hunt for
// Food minigame on top of Phase 2's movement. CharlieCard cost,
// Rest/Wait, and the full turn menu still don't exist yet - those are
// later Phase 3 slices.

const BULLET_COUNT = 6;

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
	document.getElementById("charliecard").textContent =
		`CharlieCard balance: $${player.charliecardBalance.toFixed(2)}`;
	document.getElementById("hunger").textContent =
		`Hunger: ${player.hunger}`;
	document.getElementById("difficulty").textContent =
		`Difficulty: ${player.difficulty}`;
	document.getElementById("multiplier").textContent =
		`Score multiplier: ${player.scoreMultiplier.toFixed(1)}x`;

	document.getElementById("result").textContent =
		GameState.hasArrived ? "You have reached Park Street." : "";

	document.getElementById("ride-button").disabled = GameState.hasArrived;
	document.getElementById("hunt-button").disabled = GameState.hasArrived;

	for (const buyButton of document.querySelectorAll("#food-menu button")) {
		buyButton.disabled = GameState.hasArrived || player.money < Number(buyButton.dataset.price);
	}
}

async function main() {
	await GameState.loadRedLine();
	await GameState.loadFoodMenu();
	await GameState.loadHuntMenu();
	buildFoodMenu();
	refreshDisplay();

	document.getElementById("ride-button").addEventListener("click", () => {
		GameState.rideTrain();
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
