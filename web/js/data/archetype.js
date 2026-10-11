// A commuter archetype (GDD Section 6) - determines starting line and
// resources. Loaded from data/archetypes/archetypes.json - see
// data-loader.js.

export class Archetype {
	constructor({
		id,
		name,
		difficulty,
		lineId,
		startingMoney,
		unlimitedCharliecard,
		startingCharliecardBalance,
		startingHunger,
		hungerDecayMultiplier,
		scoreMultiplier,
		flavorText,
	}) {
		this.id = id;
		this.name = name;
		this.difficulty = difficulty;
		this.lineId = lineId;
		this.startingMoney = startingMoney;
		this.unlimitedCharliecard = unlimitedCharliecard;
		this.startingCharliecardBalance = startingCharliecardBalance;
		this.startingHunger = startingHunger;
		this.hungerDecayMultiplier = hungerDecayMultiplier;
		this.scoreMultiplier = scoreMultiplier;
		this.flavorText = flavorText;
	}
}
