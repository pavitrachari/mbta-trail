// One subway station. Loaded from data/stations/*.json - see
// data-loader.js. Flavor text and station-specific mechanics (GDD
// Section 14) are added in a later phase.

export class Station {
	constructor({ id, name }) {
		this.id = id;
		this.name = name;
	}
}
