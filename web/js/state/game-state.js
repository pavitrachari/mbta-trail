import { PlayerState, Difficulty } from "./player-state.js";
import { loadRoute, loadStations } from "../data/data-loader.js";

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

	// The Station object the player is currently standing at.
	get currentStation() {
		return this.stationsById.get(this.player.currentStation);
	}

	get hasArrived() {
		return this.player.currentStation === this.route.lastStationId;
	}

	// Advances the player one stop along the route and spends the
	// route's ride time. Does nothing if already at the last station.
	rideTrain() {
		if (this.hasArrived) {
			return;
		}
		const nextStationId = this.route.nextStationId(this.player.currentStation);
		this.player.currentStation = nextStationId;
		this.player.timeElapsedMinutes += this.route.rideMinutes;
	}
}

export const GameState = new GameStateManager();
