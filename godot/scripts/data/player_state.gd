class_name PlayerState
extends RefCounted

## Everything about the player's current run through the subway system.
## GameState owns exactly one of these. UI scenes should read from it
## and call methods on GameState to change it, rather than mutating
## fields directly from arbitrary places.

enum Difficulty { EASY, MEDIUM, HARD }

var current_station: String
var time_elapsed_minutes: int
var money: float
var charliecard_balance: float
var hunger: int
var difficulty: Difficulty
var score_multiplier: float

func _init(
	p_current_station: String,
	p_time_elapsed_minutes: int,
	p_money: float,
	p_charliecard_balance: float,
	p_hunger: int,
	p_difficulty: Difficulty,
	p_score_multiplier: float
) -> void:
	current_station = p_current_station
	time_elapsed_minutes = p_time_elapsed_minutes
	money = p_money
	charliecard_balance = p_charliecard_balance
	hunger = p_hunger
	difficulty = p_difficulty
	score_multiplier = p_score_multiplier
