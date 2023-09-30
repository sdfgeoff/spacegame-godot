extends Node


var targets: GNC_Targets = Payload.create_gnc_targets(
	0,0,0,
	0,0,0
)

var thrusters = {}

func _on_bus_message(message: Message):
	if message.topic == Payload.Topic.GNC_TARGETS:
		targets = message.data
	if message.topic == Payload.Topic.GNC_THRUSTERSTATE:
		thrusters[message.address_from] = message

func _ready():
	$BusConnection.subscriptions = [Payload.Topic.GNC_TARGETS, Payload.Topic.GNC_THRUSTERSTATE]
	$BusConnection.connect("got_message", _on_bus_message)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var lin_targets = Vector3(
		targets.linear_x,
		targets.linear_y,
		targets.linear_z
	) * 10.0
	
	var ang_targets = Vector3(
		targets.angular_x,
		targets.angular_y,
		targets.angular_z
	) * 1.0
	
	var ship: RigidBody3D = get_parent()
	
	var to_shipspace = ship.global_transform.basis.inverse()
	var lin_velocity_shipspace = to_shipspace * ship.linear_velocity
	var ang_velocity_shipspace = to_shipspace * ship.angular_velocity
	#var lin_targets_worldspace = ship.global_transform.basis * lin_targets
	#var ang_targets_worldspace = ship.global_transform.basis * ang_targets


	#ship.linear_velocity = lin_targets_worldspace * 1.0
	#ship.angular_velocity = ang_targets_worldspace * 1.0

	# return
	
	var target_force = lin_targets#  - lin_velocity_shipspace) * 0.01
	var target_torque = ang_targets# - ang_velocity_shipspace) * 0.01
	
	for thruster_address in thrusters:
		var thruster: GNC_ThrusterState = thrusters[thruster_address].data
		
		var engine_local_vector := -thruster.mount.basis.y * thruster.max_thrust_newtons
		var engine_local_position := thruster.mount.origin
		
		var engine_lin_component := engine_local_vector.dot(target_force);
		var engine_torque_output := engine_local_vector.cross(engine_local_position).normalized();
		var engine_ang_component := engine_torque_output.dot(target_torque);

		var engine_output := engine_lin_component + engine_ang_component;
		engine_output = clamp(engine_output, 0.0, 1.0) * thruster.max_thrust_newtons;
		
		$BusConnection.queue_message(
			Payload.Topic.GNC_THRUSTERCOMMAND,
			Payload.create_gnc_thrustercommand(
				engine_output
			),
			thruster_address
		)
	
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
	
