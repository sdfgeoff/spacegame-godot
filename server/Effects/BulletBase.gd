class_name BulletBase
extends RayCast3D

var velocity: float = 0
@export var mass_kg: float = 0
@export var tracer_size: float = 1.0
@export var tracer_hue: float = 1.0
@export var explosion: PackedScene = null

var old_position: Vector3


func setup(delta, time_offset):
	var velocityVector := global_transform.basis * Vector3(0,velocity,0)
	velocityVector *= (delta + time_offset)
	time_offset = 0
	target_position = Vector3(0, velocityVector.length(),0)
