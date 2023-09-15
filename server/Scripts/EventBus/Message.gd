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


func serialize():
	return JSON.stringify({
		"address_from": address_from,
		"address_to": address_to,
		"message": {
			"topic": Payload.TOPIC_TO_STRING[topic],
			"payload": Message._obj_to_dict(data)
		}
	})

static func deserialize(d: String):
	var as_dict = JSON.parse_string(d)
	var t = Payload.STRING_TO_TOPIC[as_dict["message"]['topic']]
	return Message.new(
		t,
		Message._dict_to_obj(t, as_dict["message"]["payload"]),
		as_dict.get("address_to"),
		as_dict.get("address_from")
	)
	

static func _obj_to_dict(d: Object):
	var out = {}
	for prop in d.get_property_list():
		if ['RefCounted', 'script'].find(prop['name']) != -1:
			continue
		if prop['name'].contains('.'):
			continue
		out[prop['name']] = d.get(prop['name'])
	return out
	
	
static func _dict_to_obj(t: Topic, d: Dictionary):
	var type = Payload.TOPIC_TO_TYPE[t]
	var new = type.new()
	
	for prop in new.get_property_list():
		if ['RefCounted', 'script'].find(prop['name']) != -1:
			continue
		if prop['name'].contains('.'):
			continue
		new.set(prop['name'], d[prop['name']])
	return new
