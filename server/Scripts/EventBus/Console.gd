extends Node

var console_connection: ConsoleConnection

func setup(cons_connection: ConsoleConnection):
	console_connection = cons_connection
	add_child(cons_connection)
	console_connection.connect("messageFromConsole", on_message_from_console)

func on_message_from_console(data: String):
	var packet = JSON.parse_string(data)
	$BusConnection.queue_message(
		Message.STRING_TO_TOPIC[packet["message"]["topic"]],
		packet["message"]["payload"],
		packet.get("address_to")
	)

func _on_bus_connection_got_message(message: Message):
	console_connection.sendMessageToConsole(JSON.stringify({
		"address_from": message.address_from,
		"message": {
			"topic": Message.TOPIC_TO_STRING[message.topic],
			"payload": message.data
			
		}
	}))
