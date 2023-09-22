extends Node


var targets: GNC_Targets = null


func _on_bus_message(message: Message):
	if message.topic == Payload.Topic.GNC_TARGETS:
		targets = message.data
	
func _ready():
	$BusConnection.subscriptions = [Payload.Topic.GNC_TARGETS]
	$BusConnection.connect("got_message", _on_bus_message)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if targets == null:
		return
	
	var lin_targets = Vector3(
		targets.linear_x,
		targets.linear_y,
		targets.linear_z
	)
	
	var ang_targets = Vector3(
		targets.angular_x,
		targets.angular_y,
		targets.angular_z
	)
	
	var par: RigidBody3D = get_parent()
	var lin_targets_worldspace = par.global_transform.basis * lin_targets
	var ang_targets_worldspace = par.global_transform.basis * ang_targets
	par.linear_velocity = lin_targets_worldspace * 20.0
	par.angular_velocity = ang_targets_worldspace * 1.0
	
	
	
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
