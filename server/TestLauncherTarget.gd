extends Node3D


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var speed = 20.0 * delta
	if Input.is_action_pressed("strafe_right"):
		position.x += speed
	if Input.is_action_pressed("strafe_left"):
		position.x -= speed
	if Input.is_action_pressed("strafe_forwards"):
		position.z -= speed
	if Input.is_action_pressed("strafe_backwards"):
		position.z += speed
	if Input.is_action_pressed("strafe_up"):
		position.y += speed
	if Input.is_action_pressed("strafe_down"):
		position.y -= speed
	
func kinetic_impact(
	hitShape,
	hitPoint,
	hitNormal,
	hitVelocity,
	hitMassKg,
):
	print("HIT!", hitMassKg)
	
