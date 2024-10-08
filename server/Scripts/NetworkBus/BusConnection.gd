class_name BusConnection
extends Node

signal got_message(message: Message)


var _inbox: Array[Message] = []
var _outbox: Array[Message] = []
var _address = -1
@export var subscriptions = []  # Should be typed as Array[Payload.Topic] but this breaks things for some reason


var _bus: WeakRef = weakref(null)

var LOG = Log.new("BusConnection")

func _ready():
	var bus: NetworkBus = get_parent().get_parent().get_node_or_null("NetworkBus")
	if bus == null:
		LOG.warn("no_network_bus_found", {})
	_bus = weakref(bus)


func queue_message(topic, data, address_to=null):
	_outbox.append(Message.new(topic, data, address_to, null))
	
func queue_message_direct(message: Message):
	_outbox.append(message)
	
func clear_outbox() -> Array[Message]:
	var out = _outbox
	_outbox = []
	return out


func get_address():
	return _address


func poll():
	for message in _inbox:
		got_message.emit(message)
	_inbox.clear()

	var bus = _bus.get_ref()
	if bus != null:
		bus.device_exists(self)


func _process(_delta):
	poll()
