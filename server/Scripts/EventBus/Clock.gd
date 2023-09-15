extends Node

func _on_bus_connection_got_message(message: Message):
	if message.topic == Message.Topic.PING:
		$BusConnection.queue_message(
			Message.Topic.PONG,
			{
				"time_ping_sent": message.data["time_ping_sent"],
				"time_server_recieved": Time.get_ticks_msec()
			},
			message.address_from
		)
