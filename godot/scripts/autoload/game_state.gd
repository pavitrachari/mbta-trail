extends Node

## Global source of truth for the current run's state.
## Registered as the "GameState" autoload (see project.godot), so any
## script can reach it as GameState.player without holding a reference.

var player: PlayerState

func _ready() -> void:
	# Placeholder Easy-mode defaults just to prove the architecture works.
	# Real archetype selection (Phase 2/3) will replace this with values
	# loaded from data/archetypes/.
	player = PlayerState.new(
		"Alewife",  # current_station
		0,          # time_elapsed_minutes
		40.0,       # money
		10.0,       # charliecard_balance
		100,        # hunger
		PlayerState.Difficulty.EASY,
		1.0         # score_multiplier
	)
