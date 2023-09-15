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




# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var target: Node3D = get_node_or_null(target_node)
	if target == null:
		return
		
	var sight = get_node(node_sight)

	#var vect_to_global = sight.global_position - target.global_position
	#var vect_to_local = global_transform.basis * vect_to_global

	var error: Vector3 = (sight.global_transform.inverse() * target.global_position).normalized()

	var error_x = atan2(error.z, error.y)
	var error_y = atan2(error.x, error.y)


	var x_axis_node = get_node(x_axis)
	x_axis_node.target_angle = wrapf(x_axis_node.current_angle - error_x, -PI, PI)

	var y_axis_node = get_node(y_axis)
	y_axis_node.target_angle = wrapf(y_axis_node.current_angle - error_y, -PI, PI)
	
	
