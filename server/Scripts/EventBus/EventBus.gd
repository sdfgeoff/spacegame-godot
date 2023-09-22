extends Node


var _devices: Array[BusConnection] = []
var min_id = 0

func _process(_delta):
	var all_messages: Array[Message] = []
	
	for device in _devices:
		if device == null:
			# THis is a patch for when consoles disconnect. A better solution
			# would be to avoid the _device registration and instead figure out
			# available devices by listing all children in a group
			continue
		var messages = device.clear_outbox()
		if device._address == -1:
			device._address = min_id
			min_id += 1

		for message in messages:
			message.address_from = device._address

		all_messages.append_array(messages)

	for message in all_messages:
		for device in _devices:
			if device == null:
				# THis is a patch for when consoles disconnect. A better solution
				# would be to avoid the _device registration and instead figure out
				# available devices by listing all children in a group
				continue
			
			var topic_matches = device.subscriptions.find(message.topic) != -1
			var subscribed_to_all = device.subscriptions.find(Payload.Topic.ALL) != -1
			var message_has_address = message.address_to != null
			var address_matches = device._address == message.address_to
			if subscribed_to_all or address_matches or (topic_matches and !message_has_address):
				device._inbox.append(message)

	_devices.clear()
	
	

func device_exists(device: BusConnection):
	_devices.append(device)
	
