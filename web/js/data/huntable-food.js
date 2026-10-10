// One food item that can appear in the "Hunt for Food" minigame.
// Loaded from data/food/huntable_foods.json - see data-loader.js.
// `emoji` is the whole visual for this item - no image assets needed
// for a minimal platform-scene look.

export class HuntableFood {
	constructor({ id, name, emoji, hungerRestored }) {
		this.id = id;
		this.name = name;
		this.emoji = emoji;
		this.hungerRestored = hungerRestored;
	}
}
