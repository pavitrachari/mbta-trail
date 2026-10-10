// One possible result of "Hunt for Food" (GDD Section 12). Loaded from
// data/food/hunt_outcomes.json - see data-loader.js. `weight` is the
// outcome's relative likelihood, used by util/weighted-random.js.

export class HuntOutcome {
	constructor({ id, flavorText, hungerRestored, weight }) {
		this.id = id;
		this.flavorText = flavorText;
		this.hungerRestored = hungerRestored;
		this.weight = weight;
	}
}
