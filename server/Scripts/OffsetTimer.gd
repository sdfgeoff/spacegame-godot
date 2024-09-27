class_name OffsetTimer
extends Node
## A continually running timer where the first period is a random duration between
## zero and the normal duration. This means that if you have two OffsetTimers,
## and add them to the scene at the same time, they will fire at different times
## even if they have the same duration.

## This is not based on a normal Godot timer so that it correctly handles
## sub-frame timing on loops (and makes that information available to connected devices)

@export var interval: float = 0.0
## How long to wait between triggering

@export var time_since_event: float = 0.0
## How long it has been since it last triggered

signal timeout

func _init(intv):
	interval = intv
	assert(interval > 0.0, "Timer intervals must be real positive numbers")
	time_since_event = interval * randf()	

func _process(delta: float):
	time_since_event += delta
	while time_since_event >= interval:
		emit_signal("timeout")
		time_since_event -= interval
