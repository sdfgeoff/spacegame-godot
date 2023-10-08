extends StaticBody3D
# Makes an object destructable.

@export var max_energy_absorbtion: float = 1000.0
@export var explosion_scene: PackedScene

var remaining_energy_absorbtion: float = 0

func _ready():
	remaining_energy_absorbtion = max_energy_absorbtion

func kinetic_impact(
	shape: int,
	point: Vector3,
	normal: Vector3,
	velocity: Vector3,
	mass: float
): 
	remaining_energy_absorbtion -= 0.5 * (mass * velocity.length_squared())
	
	if remaining_energy_absorbtion < 0.0:
		var explosion = explosion_scene.instantiate()
		get_tree().get_root().add_child(explosion)
		queue_free()
	print(remaining_energy_absorbtion)
	
