import { Station } from "./station.js";
import { Route } from "./route.js";

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
