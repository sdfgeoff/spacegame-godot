extends Node


var targets: GNC_Targets = Payload.create_gnc_targets(
	0,0,0,
	0,0,0
)

var thrusters: Array[Message] = []

var kinematics_matrix_forward = []  # This matrix * the thruster percentages will give the force/torque exerted on the craft
var kinematics_matrix_pseudo_inverse = []
var matrix_dirty = false


func calc_kinematics(thr: Array[Message]):
	""" Computes a forwards kinematics matrix """
	var matrix = []

	for thruster_message in thr:	
		var thruster_data: GNC_ThrusterState = thruster_message.data
		var engine_local_vector := thruster_data.mount.basis.y
		var engine_local_position := thruster_data.mount.origin
		
		var max_force := engine_local_vector * thruster_data.max_thrust_newtons
		var max_torque := max_force.cross(engine_local_position)

		var sixvec = [max_force.x, max_force.y, max_force.z, max_torque.x, max_torque.y, max_torque.z]
		matrix.append(sixvec)

	return matrix


func _on_bus_message(message: Message):
	if message.topic == Payload.Topic.GNC_TARGETS:
		targets = message.data
	if message.topic == Payload.Topic.GNC_THRUSTERSTATE:
		var existing_thruster_id = null
		for thruster_id in thrusters.size():
			if thrusters[thruster_id].address_from == message.address_from:
				existing_thruster_id = thruster_id
				break
		if existing_thruster_id == null:
			thrusters.append(message)
			matrix_dirty = true
		else:
			thrusters[existing_thruster_id] = message
			if message.data.mount != thrusters[existing_thruster_id].data.mount:  # Technically also need to check max thrust
				matrix_dirty = true


func _ready():
	$BusConnection.subscriptions = [Payload.Topic.GNC_TARGETS, Payload.Topic.GNC_THRUSTERSTATE]
	$BusConnection.connect("got_message", _on_bus_message)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	
	if matrix_dirty == true:
		print("Recomputing thruster kinematics")
		kinematics_matrix_forward = calc_kinematics(thrusters)
		kinematics_matrix_pseudo_inverse = $GncUtil.PseudoInverse(kinematics_matrix_forward)
		matrix_dirty = false
	
	if kinematics_matrix_forward.size() == 0:
		return

	var lin_targets = Vector3(
		targets.linear_x,
		targets.linear_y,
		targets.linear_z
	) * 100.0
	
	var ang_targets = Vector3(
		targets.angular_x,
		targets.angular_y,
		targets.angular_z
	) * 10.0
	
	
	var ship: RigidBody3D = get_parent()
	
	var to_shipspace = ship.global_transform.basis.inverse()
	var lin_velocity_shipspace = to_shipspace * ship.linear_velocity
	var ang_velocity_shipspace = to_shipspace * ship.angular_velocity
	
	# I wonder if the oscillation in linear comes from offset between intended motion and real motion causing coupling between rotation and translation
	# The damping here is not ideal as this is not a real controller.
	var target_force = (lin_targets - lin_velocity_shipspace * 0.1) * -1.0 # TODO: Find where this -1 comes from. Am I doing force.cross(distance) wrokng up above or something?
	var target_torque = (ang_targets - ang_velocity_shipspace * 1.0)
	
	# Clamp target force and torque
	target_force = target_force.limit_length(1.0)
	target_torque = target_torque.limit_length(1.0)

	var thruster_percents = $GncUtil.ComputeThrustForPercentMotion(
		target_force,
		target_torque,
		kinematics_matrix_forward,
		kinematics_matrix_pseudo_inverse
	)

	for thruster_id in thrusters.size():
		var thruster_message = thrusters[thruster_id]
		var thruster: GNC_ThrusterState = thruster_message.data
		var thruster_address = thruster_message.address_from
		
		var engine_output = thruster_percents[thruster_id]
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
	
