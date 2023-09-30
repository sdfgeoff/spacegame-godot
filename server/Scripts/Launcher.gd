extends CollisionShape3D

@export var launcher_type: String = ""

# Node containing FakeMotor to use as X Axis
@export var x_axis: NodePath = ""

# Node containing FakeMotor to use as Y Axis
@export var y_axis: NodePath = ""

# What node to use to aim the turret. This node will end up pointing at the target
@export var node_sight: NodePath = ""

# Guns!
@export var barrels: Array[NodePath] = []

@export var target_node: NodePath


@export var ammo: int = 100
@export var seconds_between_shots: float = 1.0
@export var reload_variance_proportion: float = 0.1
@export var muzzle_velocity: float = 0.0
@export var bullet: PackedScene = preload("res://Effects/MinigunRoundBase.tscn")

@export var bullet_spread: float = 0.003
@export var allow_firing: bool = true
@export var suitable_angle_to_fire = 0.05;  # How locked on does it have to be to fire
var active_barrel: int = 0
var reload_state: float = 0


var _time_since_status_report: float = 0

var target_designation: String = ''

var target: Node3D = null


func _ready():
	$BusConnection.subscriptions = [
		Payload.Topic.SENSOR_OBJECTS,
	]
	$BusConnection.connect("got_message", on_message)
	
	if target_node != null:
		target = get_node_or_null(target_node)


func on_message(message: Message):
	if message.topic == Payload.Topic.SENSOR_OBJECTS:
		var possible_targets = message.data.objects
		if target_designation == '':
			if target != null:
				target.queue_free()
				target = null

		else:
			if target == null:
				target = Node3D.new()
				add_child(target)
				target.top_level = true
			
			var target_data = null
			for p_target in possible_targets:
				if p_target['designation'] == target_designation:
					target_data = p_target
			target.global_position.x = target_data.position[0]
			target.global_position.y = target_data.position[1]
			target.global_position.z = target_data.position[2]
		
	if message.topic == Payload.Topic.WEAPONS_LAUNCHERTARGET:
		target_designation = message.data.target_designation


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	
	if reload_state > 0:
		reload_state -= delta
	_time_since_status_report += delta
	
		
	if _time_since_status_report > 0.5:
		$BusConnection.queue_message(
			Payload.Topic.WEAPONS_LAUNCHERSTATE,
			Payload.create_weapons_launcherstate(
				launcher_type,
				target_designation,
				allow_firing,
				ammo
			)
		)
		_time_since_status_report -= 0.5

	if target == null:
		return
	var angle_to_target = aim_at(target)

	if allow_firing and angle_to_target < suitable_angle_to_fire:
		if reload_state <= 0 and ammo > 0:
			fire(delta)
			


func aim_at(target: Node3D) -> float:
	var sight: Camera3D = get_node(node_sight)
	var vect_to_local: Vector3 = (sight.global_transform.inverse() * target.global_position).normalized()

	var error_tilt := -vect_to_local.y
	var error_yaw := vect_to_local.x
	
	var x_axis_node: FakeMotor = get_node(x_axis)
	x_axis_node.target_angle = wrapf(x_axis_node.current_angle - error_tilt, -PI, PI)
	var y_axis_node: FakeMotor = get_node(y_axis)
	y_axis_node.target_angle = wrapf(y_axis_node.current_angle - error_yaw, -PI, PI)
	return abs(error_tilt) + abs(error_yaw)



func fire(delta):
	var time_offset = -reload_state  # How much before the frame the bullet fired
	reload_state += seconds_between_shots * (1 + randf_range(-reload_variance_proportion, reload_variance_proportion))
	ammo -= 1
	var b: Node3D = get_node(barrels[active_barrel])
	
	if active_barrel < len(barrels) - 1:
		active_barrel += 1
	else:
		active_barrel = 0

	# Candidate for moving to some other function?
	var new_shot: BulletBase = bullet.instantiate()
	get_tree().get_root().add_child(new_shot)
	new_shot.global_transform = b.global_transform.rotated(Vector3(
		randf_range(-1, 1),
		randf_range(-1, 1),
		randf_range(-1, 1),
	).normalized(), bullet_spread)
	new_shot.velocity = muzzle_velocity
	new_shot.setup(delta, time_offset)
