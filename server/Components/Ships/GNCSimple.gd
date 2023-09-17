extends Node


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var ship = get_parent()
	$BusConnection.queue_message(
		Payload.Topic.GNC_STATE,
		Payload.create_gnc_state(
			Time.get_ticks_msec(),
			ship.global_position.x,
			ship.global_position.y,
			ship.global_position.z,
			ship.global_rotation.x,
			ship.global_rotation.y,
			ship.global_rotation.z,
		),
		null
	)
