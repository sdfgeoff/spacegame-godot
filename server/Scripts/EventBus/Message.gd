class_name Message

var topic: Payload.Topic
var data
var address_to
var address_from

func _init(t: Payload.Topic, d, at, af=null):
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

static func deserialize(d: String) -> Message:
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
	
	
static func _dict_to_obj(t: Payload.Topic, d: Dictionary):
	var type = Payload.TOPIC_TO_TYPE[t]
	var new = type.new()
	
	for prop in new.get_property_list():
		if ['RefCounted', 'script'].find(prop['name']) != -1:
			continue
		if prop['name'].contains('.'):
			continue
		new.set(prop['name'], d[prop['name']])

	return new
