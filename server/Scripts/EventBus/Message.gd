class_name Message

enum Topic {
	ALL,
	PING,
	PONG,
	SUBSCRIPTIONS,
}

const TOPIC_TO_STRING = {
	Topic.ALL: "all",
	Topic.PING: "ping",
	Topic.PONG: "pong",
	Topic.SUBSCRIPTIONS: "subscriptions"
}

const STRING_TO_TOPIC = {
	"all": Topic.ALL,
	"ping": Topic.PING,
	"pong": Topic.PONG,
	"subscriptions": Topic.SUBSCRIPTIONS,
}

var topic: Topic
var data
var address_to
var address_from

func _init(t: Topic, d, at, af=null):
	topic = t
	data = d
	address_to = at
	address_from = af


