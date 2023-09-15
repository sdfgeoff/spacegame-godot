extends RigidBody2D


@export var THRUST: Vector3 = Vector3(0.0, 10.0, 10.0);
@export var DRAG: Vector3 = Vector3(1.0, 1.0, 1.0);
@export var COLOR: Color = Color(0.2, 0.7, 0.2) : set = _set_color;


@onready var shaderMaterial: ShaderMaterial = $Sprite.material;

# Called when the node enters the scene tree for the first time.
func _ready():
	shaderMaterial = shaderMaterial.duplicate()
	$Sprite.material = shaderMaterial
	_set_color(COLOR)


func _set_color(color: Color):
	shaderMaterial.set_shader_parameter("ship_color", color)
	

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	var thrust_vector_local := Vector3(0,0,0);
	thrust_vector_local.x += float(Input.is_action_pressed("strafe_right")) - float(Input.is_action_pressed("strafe_left"))
	thrust_vector_local.y -= float(Input.is_action_pressed("strafe_forwards")) - float(Input.is_action_pressed("strafe_backwards"))
	thrust_vector_local.z -= float(Input.is_action_pressed("turn_left")) - float(Input.is_action_pressed("turn_right"))
	shaderMaterial.set_shader_parameter("ship_engine", max(-thrust_vector_local.y, 0.0))
	thrust_vector_local *= THRUST;
	

	
	var linear_speed_local := global_transform.basis_xform_inv(linear_velocity);
	var speed_vector_local := Vector3(linear_speed_local.x, linear_speed_local.y, angular_velocity);
	
	var drag_vector_local = speed_vector_local * DRAG;

	var force_local = thrust_vector_local - drag_vector_local;
	var force_global = global_transform.basis_xform(Vector2(force_local.x, force_local.y));
	apply_force(force_global)
	apply_torque(force_local.z)
	
	
	
