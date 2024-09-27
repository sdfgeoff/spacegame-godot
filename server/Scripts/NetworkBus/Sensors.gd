extends Node3D


# Objects that are seen are of type:
# {
#    designation: String,
#    position: [float, float, float],
#    time_last_seen: float
# }


var known_objects = {}


var meshes = {
	
}



func idToDesignation(id: int) -> String:
	# Note that this doesn't have to be repeatable. This is only called once
	# for any given ID
	var f1 = id % 10
	var f2 = int(id / 10.0) % 10
	var f3 = int(id / 100.0) % 10
	var f4 = int(id / 1000.0) % 10
	var outstr := '%s-%d%s%d' % [char(f1+65), f2, char(f3+65), f4]
	return outstr


func _process(_delta):
	var current_time = Time.get_ticks_msec()
	
	var to_delete = []
	for id in known_objects:
		var obj = known_objects[id]
		if obj['time_last_seen'] + 1000 < current_time:
			to_delete.append(id)

	for del_id in to_delete:
		known_objects.erase(del_id)
	
	var nodes = get_tree().get_nodes_in_group('sensable')
	
	for n in nodes:
		var node: Node = n
		var id = node.get_instance_id()
		#var mesh = node.mesh
		#var mesh_id = mesh.get_rid()
		
		# If it's the first time we've seen this, assign it a name and ensure it has
		# a visual representation
		if !known_objects.has(id):
			known_objects[id] = {
				'designation': idToDesignation(id)
			}
		#	if !meshes.has(mesh_id):
		#		print("Generating mesh for ", mesh_id)
		#		meshes[mesh_id] = mesh.surface_get_arrays(0)

		known_objects[id]['position'] = [node.global_position.x, node.global_position.y, node.global_position.z]
		known_objects[id]['time_last_seen'] = current_time
		#known_objects[id]['mesh'] = mesh_id

	$BusConnection.queue_message(
		Payload.Topic.SENSOR_OBJECTS,
		Payload.create_sensor_objects(
			known_objects.values(),
			[global_position.x, global_position.y, global_position.z]
		)
	)
	
