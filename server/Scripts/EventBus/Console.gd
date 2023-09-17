extends Node

var LOG = Log.new('console')

var console_connection: ConsoleConnection

func setup(cons_connection: ConsoleConnection):
	console_connection = cons_connection
	add_child(cons_connection)
	console_connection.connect("messageFromConsole", on_message_from_console)

func _topic_string_to_enum(topic: String) -> Payload.Topic:
	return Payload.STRING_TO_TOPIC[topic]

func on_message_from_console(data: String):
	var message := Message.deserialize(data)
	if message.topic == Payload.Topic.SUBSCRIPTIONS:
		var topics = message.data.to_topics.map(_topic_string_to_enum)
		if topics != $BusConnection.subscriptions:
			$BusConnection.subscriptions = topics
			LOG.info("change_subscription", {'topics': message.data.to_topics})
	else:
		$BusConnection.queue_message_direct(message)

func _on_bus_connection_got_message(message: Message):
	console_connection.sendMessageToConsole(message.serialize())
