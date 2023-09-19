extends Node



func _on_bus_message(message: Message):
	if message.topic == Payload.Topic.GNC_TARGETS:
		get_parent().linear_velocity.x = message.data.linear_x * 20
		get_parent().linear_velocity.y = message.data.linear_y * 20
		print(message.data.linear_x)
		print(message.data.linear_y)
	
	
func _ready():
	$BusConnection.subscriptions = [Payload.Topic.GNC_TARGETS]
	$BusConnection.connect("got_message", _on_bus_message)

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
