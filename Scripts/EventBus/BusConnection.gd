class_name BusConnection
extends Node

signal got_message


var _inbox: Array[Message] = []
var _outbox: Array[Message] = []
var _address = -1
@export var subscriptions: Array[Message.Topic] = []


func queue_message(topic, data, address_to=null):
	_outbox.append(Message.new(topic, data, address_to, null))
	
func clear_outbox() -> Array[Message]:
	var out = _outbox
	_outbox = []
	return out


func get_address():
	return _address


func _process(_delta):
	for message in _inbox:
		got_message.emit(message)
	_inbox.clear()
		
	var bus = get_parent().get_parent().get_node_or_null("EventBus")
	if bus != null:
		bus.device_exists(self)
