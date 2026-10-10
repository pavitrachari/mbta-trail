// Picks one item from a list, using each item's `weight` (any positive
// number) as its relative likelihood. Not cryptographically random -
// Math.random() is fine for game flavor.
export function pickWeighted(items) {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let roll = Math.random() * totalWeight;
	for (const item of items) {
		roll -= item.weight;
		if (roll < 0) {
			return item;
		}
	}
	return items[items.length - 1];
}
