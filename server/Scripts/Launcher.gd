extends CollisionShape3D

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
@export var muzzle_velocity: float = 0.0
@export var bullet: PackedScene = preload("res://Effects/MinigunRoundBase.tscn")

@export var bullet_spread: float = 0.003
@export var allow_firing: bool = true
@export var suitable_angle_to_fire = 0.05;  # How locked on does it have to be to fire
var active_barrel = 0
var reload_state = 0

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var target: Node3D = get_node_or_null(target_node)
	if target == null:
		return
		
	var sight = get_node(node_sight)

	var vect_to_local: Vector3 = (sight.global_transform.inverse() * target.global_position).normalized()
	
	var error_tilt = -vect_to_local.y #atan2(error.x, error.y)
	var error_yaw = vect_to_local.x #-atan2(error.z, error.y)
	
	var x_axis_node = get_node(x_axis)
	x_axis_node.target_angle = wrapf(x_axis_node.current_angle - error_tilt, -PI, PI)

	var y_axis_node = get_node(y_axis)
	y_axis_node.target_angle = wrapf(y_axis_node.current_angle - error_yaw, -PI, PI)

	if reload_state > 0:
		reload_state -= delta

	if allow_firing and abs(error_tilt) + abs(error_yaw) < suitable_angle_to_fire:
		if reload_state <= 0 and ammo > 0:
			var time_offset = -reload_state  # How much before the frame the bullet fired
			reload_state += seconds_between_shots
			ammo -= 1
			var b = get_node(barrels[active_barrel])

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

			
