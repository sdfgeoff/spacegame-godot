class_name FakeMotor
extends Node3D
""" An angular joint that doesn't use the physics engine """

@export var max_angle: float = PI
@export var min_angle: float = -PI
@export var max_speed: float = 1.0
@export var allow_angle_wrap: bool = false
@export var target_angle: float = 0.0



var current_angle = 0.0


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var actual_target_angle = clampf(target_angle, min_angle, max_angle)

	var error = actual_target_angle - current_angle
	if allow_angle_wrap:
		error = wrapf(error, -PI, PI)

	if abs(error) < max_speed * delta:
		current_angle = actual_target_angle
	else:
		if error > 0:
			current_angle += max_speed * delta
		else:
			current_angle -= max_speed * delta

	$Output.position = Vector3(0,0,0)
	$Output.rotation = Vector3(0,current_angle,0)
