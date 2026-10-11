import { Station } from "./station.js";
import { Route } from "./route.js";
import { Food } from "./food.js";
import { HuntableFood } from "./huntable-food.js";
import { Archetype } from "./archetype.js";

export async function loadRoute(path) {
	const response = await fetch(path);
	const data = await response.json();
	return new Route(data);
}

export async function loadStations(path) {
	const response = await fetch(path);
	const data = await response.json();
	return data.map((stationData) => new Station(stationData));
}

export async function loadFoodItems(path) {
	const response = await fetch(path);
	const data = await response.json();
	return data.map((foodData) => new Food(foodData));
}

export async function loadHuntableFoods(path) {
	const response = await fetch(path);
	const data = await response.json();
	return data.map((foodData) => new HuntableFood(foodData));
}

export async function loadArchetypes(path) {
	const response = await fetch(path);
	const data = await response.json();
	return data.map((archetypeData) => new Archetype(archetypeData));
}
