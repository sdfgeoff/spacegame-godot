extends Node

@export var message: String = "TestMessage"
@export var seconds_between: float = 1.0;

var time = 0
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	time += delta
	if time > seconds_between:
		time -= seconds_between
		$Connection.queue_message(Payload.Topic.PING, message)
