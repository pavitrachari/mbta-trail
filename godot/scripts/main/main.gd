extends Control

## Phase 1 proof-of-architecture screen: displays whatever is currently
## sitting in the GameState singleton. No gameplay yet - Phase 2 replaces
## this with the real station/turn screen.

@onready var station_label: Label = %StationLabel
@onready var time_label: Label = %TimeLabel
@onready var money_label: Label = %MoneyLabel
@onready var charliecard_label: Label = %CharlieCardLabel
@onready var hunger_label: Label = %HungerLabel
@onready var difficulty_label: Label = %DifficultyLabel
@onready var multiplier_label: Label = %MultiplierLabel

func _ready() -> void:
	_refresh_display()

func _refresh_display() -> void:
	var player := GameState.player
	station_label.text = "Station: %s" % player.current_station
	time_label.text = "Time elapsed: %d min" % player.time_elapsed_minutes
	money_label.text = "Money: $%.2f" % player.money
	charliecard_label.text = "CharlieCard balance: $%.2f" % player.charliecard_balance
	hunger_label.text = "Hunger: %d" % player.hunger
	difficulty_label.text = "Difficulty: %s" % PlayerState.Difficulty.keys()[player.difficulty]
	multiplier_label.text = "Score multiplier: %.1fx" % player.score_multiplier
