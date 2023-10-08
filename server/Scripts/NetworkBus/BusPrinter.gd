extends Node


func _on_connection_got_message(message: Message):
	print(get_parent().get_parent().name, " got ", message.data, " from ", message.address_from, " on topic ", Payload.TOPIC_TO_STRING[message.topic], " to ", message.address_to)
