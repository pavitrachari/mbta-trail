// A purchasable food item. Loaded from data/food/food.json - see
// data-loader.js.

export class Food {
	constructor({ id, name, price, hungerRestored, flavorText }) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.hungerRestored = hungerRestored;
		this.flavorText = flavorText;
	}
}
