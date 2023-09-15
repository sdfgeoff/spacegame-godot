extends Node


var _devices: Array[BusConnection] = []
var min_id = 0

func _process(_delta):
	var all_messages: Array[Message] = []
	
	for device in _devices:
		var messages = device.clear_outbox()
		if device._address == -1:
			device._address = min_id
			min_id += 1

		for message in messages:
			message.address_from = device._address

		all_messages.append_array(messages)


	for message in all_messages:
		for device in _devices:
			
			if device.subscriptions.find(message.topic) != -1 and device.subscriptions.find(Message.Topic.ALL) != -1:
				continue
			
			if message.address_to != null and device._address != message.address_to:
				continue
				
			device._inbox.append(message)

	_devices.clear()

func device_exists(device: BusConnection):
	_devices.append(device)
	
