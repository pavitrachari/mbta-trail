// A tiny Spacewar!-inspired shooting gallery (Spacewar! was built at
// MIT in 1962 - the one piece of "real" Boston trivia behind this).
// The player's ship flies around a starfield and shoots food targets
// with a limited number of bullets. This module is pure UI/physics -
// it knows nothing about GameState, money, or hunger. The caller gets
// back which foods were hit and applies the game effects itself.

const SHIP_SPEED = 2.2; // px per frame
const BULLET_SPEED = 5; // px per frame
const SHIP_RADIUS = 14;
const FOOD_RADIUS = 16;
const BULLET_RADIUS = 3;
const HIT_DISTANCE = FOOD_RADIUS + BULLET_RADIUS;
const MAX_SESSION_MS = 12000; // safety net so a hunt never drags on
const FOOD_DRIFT_SPEED = 0.4; // px per frame

const DIRECTION_VECTORS = {
	ArrowUp: { x: 0, y: -1 },
	ArrowDown: { x: 0, y: 1 },
	ArrowLeft: { x: -1, y: 0 },
	ArrowRight: { x: 1, y: 0 },
};
const DIRECTION_ROTATION_DEG = {
	ArrowUp: 0,
	ArrowRight: 90,
	ArrowDown: 180,
	ArrowLeft: 270,
};

function place(element, x, y, rotationDeg) {
	element.style.transform = rotationDeg === undefined
		? `translate(${x}px, ${y}px) translate(-50%, -50%)`
		: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rotationDeg}deg)`;
}

// Runs one hunt session inside arenaElement. candidateFoods is the
// full list of targets to spawn (one each); bulletCount is the total
// shots available. onBulletsChange(remaining) is called whenever the
// bullet count changes, so the caller can update its own status text.
// Resolves with the array of foods that got shot.
export function runHuntMinigame(arenaElement, candidateFoods, bulletCount, onBulletsChange) {
	return new Promise((resolve) => {
		const width = arenaElement.clientWidth;
		const height = arenaElement.clientHeight;

		const shipElement = document.createElement("div");
		shipElement.className = "hunt-ship";
		shipElement.textContent = "🚀";
		arenaElement.append(shipElement);

		const ship = { x: width / 2, y: height / 2, facing: "ArrowUp" };

		const targets = candidateFoods.map((food) => {
			const element = document.createElement("div");
			element.className = "hunt-food-target";
			element.textContent = food.emoji;
			arenaElement.append(element);
			const angle = Math.random() * Math.PI * 2;
			return {
				food,
				element,
				x: Math.random() * (width - 40) + 20,
				y: Math.random() * (height - 40) + 20,
				vx: Math.cos(angle) * FOOD_DRIFT_SPEED,
				vy: Math.sin(angle) * FOOD_DRIFT_SPEED,
			};
		});

		const bullets = [];
		let bulletsRemaining = bulletCount;
		const caught = [];
		const pressedKeys = new Set();

		function fire() {
			if (bulletsRemaining <= 0) {
				return;
			}
			bulletsRemaining -= 1;
			onBulletsChange(bulletsRemaining);
			const direction = DIRECTION_VECTORS[ship.facing];
			const element = document.createElement("div");
			element.className = "hunt-bullet";
			arenaElement.append(element);
			bullets.push({
				x: ship.x,
				y: ship.y,
				vx: direction.x * BULLET_SPEED,
				vy: direction.y * BULLET_SPEED,
				element,
			});
		}

		function onKeyDown(event) {
			if (DIRECTION_VECTORS[event.key]) {
				pressedKeys.add(event.key);
				ship.facing = event.key;
				event.preventDefault();
			} else if (event.code === "Space") {
				event.preventDefault();
				fire();
			}
		}
		function onKeyUp(event) {
			pressedKeys.delete(event.key);
		}

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		onBulletsChange(bulletsRemaining);

		const startTime = performance.now();
		let animationFrameId;

		function finish() {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			cancelAnimationFrame(animationFrameId);
			shipElement.remove();
			for (const bullet of bullets) {
				bullet.element.remove();
			}
			for (const target of targets) {
				target.element.remove();
			}
			resolve(caught);
		}

		function step() {
			for (const key of pressedKeys) {
				const direction = DIRECTION_VECTORS[key];
				ship.x += direction.x * SHIP_SPEED;
				ship.y += direction.y * SHIP_SPEED;
			}
			ship.x = Math.max(SHIP_RADIUS, Math.min(width - SHIP_RADIUS, ship.x));
			ship.y = Math.max(SHIP_RADIUS, Math.min(height - SHIP_RADIUS, ship.y));
			place(shipElement, ship.x, ship.y, DIRECTION_ROTATION_DEG[ship.facing]);

			for (const target of targets) {
				target.x += target.vx;
				target.y += target.vy;
				if (target.x < 0) target.x += width;
				if (target.x > width) target.x -= width;
				if (target.y < 0) target.y += height;
				if (target.y > height) target.y -= height;
				place(target.element, target.x, target.y);
			}

			for (let i = bullets.length - 1; i >= 0; i--) {
				const bullet = bullets[i];
				bullet.x += bullet.vx;
				bullet.y += bullet.vy;
				if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
					bullet.element.remove();
					bullets.splice(i, 1);
					continue;
				}
				place(bullet.element, bullet.x, bullet.y);

				for (let j = targets.length - 1; j >= 0; j--) {
					const target = targets[j];
					if (Math.hypot(bullet.x - target.x, bullet.y - target.y) < HIT_DISTANCE) {
						caught.push(target.food);
						target.element.remove();
						targets.splice(j, 1);
						bullet.element.remove();
						bullets.splice(i, 1);
						break;
					}
				}
			}

			const outOfTime = performance.now() - startTime > MAX_SESSION_MS;
			const allBulletsSpent = bulletsRemaining === 0 && bullets.length === 0;
			if (outOfTime || allBulletsSpent || targets.length === 0) {
				finish();
				return;
			}
			animationFrameId = requestAnimationFrame(step);
		}

		animationFrameId = requestAnimationFrame(step);
	});
}
