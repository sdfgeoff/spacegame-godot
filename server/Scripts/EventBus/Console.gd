extends Node

var console_connection: ConsoleConnection

func setup(cons_connection: ConsoleConnection):
	console_connection = cons_connection
	add_child(cons_connection)
	console_connection.connect("messageFromConsole", on_message_from_console)

func on_message_from_console(data: String):
	$BusConnection.queue_message_direct(Message.deserialize(data))

func _on_bus_connection_got_message(message: Message):
	console_connection.sendMessageToConsole(message.serialize())
