import { GameState } from "./state/game-state.js";

// Phase 3 screen: adds hunger decay, a food menu, and Hunt for Food on
// top of Phase 2's movement. CharlieCard cost, Rest/Wait, and the full
// turn menu still don't exist yet - those are later Phase 3 slices.

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

	document.getElementById("hunt-button").addEventListener("click", () => {
		const outcome = GameState.huntForFood();
		document.getElementById("hunt-message").textContent = outcome.flavorText;
		refreshDisplay();
	});
}

main();
