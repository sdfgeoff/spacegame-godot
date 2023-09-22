"""
I want lots of projectiles, lots. This means that I don't want to use physics nodes
and meshes for all of them. Instead they are all drawn at once by a MultiMeshInstance3D,
and their transforms are all computed at once. Collision/damage is handled by raycasting
rather than collision detection.
"""

@tool
extends MultiMeshInstance3D

@export_range(0,1) var preview_hue = 0.0


func _ready():
	multimesh.instance_count = 0
	multimesh.use_custom_data = true
	if Engine.is_editor_hint():
		# Draw a round in the editor so we can edit the VFX better
		multimesh.instance_count = 1
		multimesh.visible_instance_count = 1

		for bullet_id in multimesh.visible_instance_count:
			update_bullet(bullet_id, Transform3D(), 10.0, 1.0, 0.5)
		
	else:
		multimesh.instance_count = 0
		multimesh.visible_instance_count = 0
		



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float):
	if Engine.is_editor_hint():
		update_bullet(0, Transform3D(), 10.0, 1.0, preview_hue)
		return
		
	var bullets = get_tree().get_nodes_in_group("tracers")
	
	multimesh.instance_count = len(bullets)
	multimesh.visible_instance_count = len(bullets)

	for bullet_id in multimesh.visible_instance_count:
		var bullet: BulletBase = bullets[bullet_id]
		var velocityVector := bullet.global_transform.basis * Vector3(0,bullet.velocity,0)
		velocityVector *= delta
		
		bullet.old_position = bullet.global_position

		var nextPos := bullet.global_position + velocityVector
		bullet.target_position = Vector3(0, velocityVector.length(),0)
		if bullet.is_colliding():
			var hitPoint := bullet.get_collision_point()
			nextPos = hitPoint
			bullet.queue_free()
			var hit_obj := bullet.get_collider()
			if hit_obj.has_method("kinetic_impact"):
				hit_obj.kinetic_impact(
					bullet.get_collider_shape(),
					hitPoint,
					bullet.get_collision_normal(),
					velocityVector,
					bullet.mass_kg
				)
				
		var distTravelled := (nextPos - bullet.global_position).length()
		bullet.global_position = nextPos
		update_bullet(bullet_id, bullet.global_transform, distTravelled - 1.0, bullet.tracer_size, bullet.tracer_hue)
		

		if bullet.global_position.length() > 10000:
			bullet.queue_free()


func update_bullet(bullet_id: int, b_transform: Transform3D, length: float, tracer_size: float, tracer_hue: float):
	multimesh.set_instance_transform(bullet_id, b_transform)
	multimesh.set_instance_custom_data(bullet_id, Color(length, tracer_size, tracer_hue))
	
