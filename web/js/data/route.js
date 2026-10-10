// An ordered path of station IDs from a line's starting station to
// Park Street. Loaded from data/routes/*.json - see data-loader.js.

export class Route {
	constructor({ id, name, stationIds, rideMinutes }) {
		this.id = id;
		this.name = name;
		this.stationIds = stationIds;
		this.rideMinutes = rideMinutes;
	}

	get firstStationId() {
		return this.stationIds[0];
	}

	get lastStationId() {
		return this.stationIds[this.stationIds.length - 1];
	}

	// Station ID the player reaches after riding one stop forward from
	// fromStationId, or null if fromStationId is already the last stop.
	nextStationId(fromStationId) {
		const index = this.stationIds.indexOf(fromStationId);
		return this.stationIds[index + 1] ?? null;
	}
}
