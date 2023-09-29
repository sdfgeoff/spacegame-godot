class_name EventBus
extends Node


var _devices: Array[BusConnection] = []
var min_id: int = 0


var devices_by_address = {}
var devices_by_subscription = {}


func collect_messages() -> Array[Message]:
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
	
	return all_messages


func build_acceleration_structures():
	devices_by_address.clear()
	devices_by_subscription.clear()
	for device in _devices:
		if device == null:
			# THis is a patch for when consoles disconnect. A better solution
			# would be to avoid the _device registration and instead figure out
			# available devices by listing all children in a group
			continue
		
		devices_by_address[device._address] = device
		for topic in device.subscriptions:
			if devices_by_subscription.has(topic):
				devices_by_subscription[topic].append(device)
			else:
				devices_by_subscription[topic] = [device]

func route_messages(all_messages: Array[Message]):
	for message in all_messages:
		for device in devices_by_subscription.get(message.topic, []):
			device._inbox.append(message)
		for device in devices_by_subscription.get(Payload.Topic.ALL, []):
			device._inbox.append(message)
		
		var dev = devices_by_address.get(message.address_to)
		if dev:
			dev._inbox.append(message)




func _process(_delta):
	build_acceleration_structures()
	var all_messages = collect_messages()
	route_messages(all_messages)
	_devices.clear()
	

func device_exists(device: BusConnection):
	_devices.append(device)
	
