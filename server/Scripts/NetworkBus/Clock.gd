extends Node

func _ready():
	$BusConnection.subscriptions = [Payload.Topic.PING]

func _on_bus_connection_got_message(message: Message):
	if message.topic == Payload.Topic.PING:
		$BusConnection.queue_message(
			Payload.Topic.PONG,
			Payload.create_pong(
				message.data["time_ping_sent"],
				Time.get_ticks_msec()
			),
			message.address_from
		)
