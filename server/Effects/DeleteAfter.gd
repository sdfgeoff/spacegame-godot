extends Node

@export var seconds: float = 0.0
var elapsed = 0.0

func _process(delta):
	elapsed += delta
	if elapsed > seconds:
		queue_free()
