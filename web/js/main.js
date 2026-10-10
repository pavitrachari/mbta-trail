import { GameState } from "./state/game-state.js";

// Phase 3 screen: adds hunger decay, a food menu, and the Hunt for
// Food minigame on top of Phase 2's movement. CharlieCard cost,
// Rest/Wait, and the full turn menu still don't exist yet - those are
// later Phase 3 slices.

const MIN_CROSS_SECONDS = 1.0;
const MAX_CROSS_SECONDS = 2.0;

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

// Plays one food item crossing the platform. Resolves true if the
// player clicked it in time, false if it slid all the way across.
function playHuntRound(food) {
	return new Promise((resolve) => {
		const track = document.getElementById("platform-track");
		const token = document.createElement("div");
		token.className = "food-token";
		token.textContent = `${food.emoji} ${food.name}`;
		token.style.left = "-15%";
		token.style.transitionDuration =
			`${MIN_CROSS_SECONDS + Math.random() * (MAX_CROSS_SECONDS - MIN_CROSS_SECONDS)}s`;
		track.append(token);

		let resolved = false;
		function finish(caught) {
			if (resolved) {
				return;
			}
			resolved = true;
			token.removeEventListener("click", onClick);
			token.removeEventListener("transitionend", onEnd);
			token.remove();
			resolve(caught);
		}
		function onClick() {
			finish(true);
		}
		function onEnd() {
			finish(false);
		}

		token.addEventListener("click", onClick);
		token.addEventListener("transitionend", onEnd);

		// Setting the destination on the next frame (rather than
		// immediately) is what makes the browser actually animate the
		// move instead of snapping straight to the end position.
		requestAnimationFrame(() => {
			token.style.left = "110%";
		});
	});
}

async function runHuntMinigame() {
	const foodsThisHunt = GameState.pickHuntRoundFoods();
	const statusLabel = document.getElementById("hunt-status");
	const caught = [];

	for (const food of foodsThisHunt) {
		statusLabel.textContent = "Catch it!";
		const wasCaught = await playHuntRound(food);
		if (wasCaught) {
			caught.push(food);
		}
	}

	const hungerGained = GameState.applyHuntResults(caught);
	return { caught, hungerGained, total: foodsThisHunt.length };
}

// Disables every action button during the hunt animation, so riding
// the train or buying food can't interleave with an in-progress hunt.
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
		document.getElementById("hunt-game").hidden = false;
		document.getElementById("hunt-message").textContent = "";

		const { caught, hungerGained, total } = await runHuntMinigame();

		document.getElementById("hunt-game").hidden = true;
		document.getElementById("hunt-status").textContent = "";
		document.getElementById("hunt-message").textContent = caught.length > 0
			? `Caught ${caught.length}/${total}: ${caught.map((food) => food.name).join(", ")}. (+${hungerGained} hunger)`
			: `Caught nothing this time (0/${total}).`;

		refreshDisplay();
	});
}

main();
