"""
I want lots of projectiles, lots. This means that I don't want to use physics nodes
and meshes for all of them. Instead they are all drawn at once by a MultiMeshInstance3D,
and their transforms are all computed at once. Collision/damage is handled by raycasting
rather than collision detection.
"""

@tool
extends MultiMeshInstance3D


func _ready():
	if Engine.is_editor_hint():
		# Draw a round in the editor so we can edit the VFX better
		multimesh.instance_count = 1
		multimesh.visible_instance_count = 1

		for i in multimesh.visible_instance_count:
			multimesh.set_instance_transform(i, Transform3D(
				Vector3(1, 0, 0),
				Vector3(0, 10, 0),
				Vector3(0, 0, 1),
				Vector3(0, 0, 0),
			))
	else:
		multimesh.instance_count = 0
		multimesh.visible_instance_count = 0
		



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if Engine.is_editor_hint():
		return
		
	var bullets = get_tree().get_nodes_in_group("minigun_round")
	
	multimesh.instance_count = len(bullets)
	multimesh.visible_instance_count = len(bullets)

	for bullet_id in multimesh.visible_instance_count:
		var bullet: RayCast3D = bullets[bullet_id]
		var velocityVector := bullet.global_transform.basis * Vector3(0,bullet.velocity,0)
		velocityVector *= delta
		
		bullet.old_position = bullet.global_position

		var nextPos = bullet.global_position + velocityVector
		bullet.target_position = Vector3(0, velocityVector.length(),0)
		if bullet.is_colliding():
			var hitPoint = bullet.get_collision_point()
			nextPos = hitPoint
			bullet.queue_free()
			var hit_obj = bullet.get_collider()
			if hit_obj.has_method("kinetic_impact"):
				hit_obj.kinetic_impact(
					bullet.get_collider_shape(),
					hitPoint,
					bullet.get_collision_normal(),
					velocityVector,
					bullet.mass_kg
				)
				
		var distTravelled = (nextPos - bullet.global_position).length()
		bullet.global_position = nextPos

		multimesh.set_instance_transform(bullet_id, Transform3D(
			bullet.global_transform.basis,
			(bullet.old_position + bullet.global_position) / 2
		).scaled_local(Vector3(1, distTravelled,1)))
		
		if bullet.global_position.length() > 10000:
			bullet.queue_free()
