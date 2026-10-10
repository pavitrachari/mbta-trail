import { PlayerState, Difficulty } from "./player-state.js";
import { loadRoute, loadStations, loadFoodItems, loadHuntableFoods } from "../data/data-loader.js";

// Placeholder balancing constants. Not yet data-driven (GDD Section 19
// eventually wants these externalized too) because there's only one
// of each so far - worth revisiting once real balancing starts and
// there's an actual reason to rebalance them independently.
const HUNGER_DECAY_PER_MINUTE = 1;
const BUY_FOOD_MINUTES = 3;
const HUNT_MINUTES = 5;
const HUNT_ROUNDS = 6;

// Fisher-Yates shuffle, used to pick a random sample of foods for one
// hunt without repeats.
function shuffledSample(items, count) {
	const pool = [...items];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, count);
}

// Global source of truth for the current run's state. Because ES
// modules are evaluated once and cached, every file that imports
// gameState below gets this exact same instance.
class GameStateManager {
	constructor() {
		// Placeholder Easy-mode defaults, just like Phase 1. currentStation
		// is overwritten once the route finishes loading. Real archetype
		// selection (Phase 2/3) will replace this with values loaded from
		// data/archetypes/.
		this.player = new PlayerState({
			currentStation: null,
			timeElapsedMinutes: 0,
			money: 40.0,
			charliecardBalance: 10.0,
			hunger: 100,
			difficulty: Difficulty.EASY,
			scoreMultiplier: 1.0,
		});

		this.route = null;
		this.stationsById = null;
		this.foodItems = null;
		this.huntableFoods = null;
	}

	// Loads the Red Line's route and station data and places the player
	// at the first station. Must be awaited before anything reads
	// currentStation or calls rideTrain().
	async loadRedLine() {
		this.route = await loadRoute("../data/routes/red_line.json");
		const stations = await loadStations("../data/stations/red_line.json");
		this.stationsById = new Map(stations.map((station) => [station.id, station]));
		this.player.currentStation = this.route.firstStationId;
	}

	// Loads the available food items. Must be awaited before calling
	// buyFood() or listing foodItems in the UI.
	async loadFoodMenu() {
		this.foodItems = await loadFoodItems("../data/food/food.json");
	}

	// Loads the foods that can appear in the "Hunt for Food" minigame.
	// Must be awaited before calling pickHuntRoundFoods().
	async loadHuntMenu() {
		this.huntableFoods = await loadHuntableFoods("../data/food/huntable_foods.json");
	}

	// The Station object the player is currently standing at.
	get currentStation() {
		return this.stationsById.get(this.player.currentStation);
	}

	get hasArrived() {
		return this.player.currentStation === this.route.lastStationId;
	}

	// Spends time and, as a side effect, drains hunger. Every action
	// that takes time should go through this rather than touching
	// timeElapsedMinutes directly, so hunger decay stays in one place.
	advanceTime(minutes) {
		this.player.timeElapsedMinutes += minutes;
		this.player.hunger = Math.max(0, this.player.hunger - minutes * HUNGER_DECAY_PER_MINUTE);
	}

	// Advances the player one stop along the route and spends the
	// route's ride time. Does nothing if already at the last station.
	rideTrain() {
		if (this.hasArrived) {
			return;
		}
		const nextStationId = this.route.nextStationId(this.player.currentStation);
		this.player.currentStation = nextStationId;
		this.advanceTime(this.route.rideMinutes);
	}

	// Buys one food item by ID: spends money and time, restores hunger
	// (capped at 100). Returns the Food bought, or null if the player
	// can't afford it or the ID doesn't match a loaded item.
	buyFood(foodId) {
		const food = this.foodItems.find((item) => item.id === foodId);
		if (!food || this.player.money < food.price) {
			return null;
		}
		this.player.money -= food.price;
		this.advanceTime(BUY_FOOD_MINUTES);
		this.player.hunger = Math.min(100, this.player.hunger + food.hungerRestored);
		return food;
	}

	// Picks the random, non-repeating set of foods that will appear in
	// one "Hunt for Food" minigame session. Pure selection - no state
	// change and no time cost yet; that happens in applyHuntResults()
	// once the player has actually played the round.
	pickHuntRoundFoods() {
		return shuffledSample(this.huntableFoods, HUNT_ROUNDS);
	}

	// Called once a hunt session is over. Always costs HUNT_MINUTES,
	// regardless of how many foods were caught - skill decides the
	// haul, not how long the search takes. Returns the total hunger
	// restored.
	applyHuntResults(caughtFoods) {
		this.advanceTime(HUNT_MINUTES);
		const hungerGained = caughtFoods.reduce((sum, food) => sum + food.hungerRestored, 0);
		this.player.hunger = Math.min(100, this.player.hunger + hungerGained);
		return hungerGained;
	}
}

export const GameState = new GameStateManager();
