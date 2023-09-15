class_name Message

enum Topic {ALL, PING}

var topic: Topic
var data
var address_to
var address_from

func _init(t: Topic, d, at, af=null):
	topic = t
	data = d
	address_to = at
	address_from = af
