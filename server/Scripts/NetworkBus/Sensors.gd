extends Node3D


# Objects that are seen are of type:
# {
#    designation: String,
#    position: [float, float, float],
#    time_last_seen: float
# }


var known_objects = {}



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
	
	for node in nodes:
		if node == get_parent():
			continue
		var id = node.get_instance_id()
		if !known_objects.has(id):
			# TODO: Change the designation to something readable
			known_objects[id] = {
				'designation': '%X' % id
			}

		known_objects[id]['position'] = [node.global_position.x, node.global_position.y, node.global_position.z]
		known_objects[id]['time_last_seen'] = current_time

	$BusConnection.queue_message(
		Payload.Topic.SENSOR_OBJECTS,
		Payload.create_sensor_objects(
			known_objects.values(),
			[global_position.x, global_position.y, global_position.z]
		)
	)
	
