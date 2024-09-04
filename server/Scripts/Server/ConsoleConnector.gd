""" 
Connects to the tracker and publishes the existence of this ship. 
When a connection is established, creates a child component with the connection.
"""
extends Node

var LOG = Log.new("console_tracker")

const CONSOLE_SCENE = preload("res://Components/ShipParts/Console.tscn")

# The URL we will connect to
var websocket_url = "ws://0.0.0.0:%d" % ConsoleTracker.PORT

var _last_broadcast_time = 0
const BROADCAST_DELAY_MSEC = 5000

# Our WebSocketClient instance
var tracker_client = WebSocketClient.new()
var clients = {}


func ship_name():
	return get_parent().name
	
func ship_type():
	return get_parent().name

func _ready():
	tracker_client.connection_closed.connect(_closed)
	tracker_client.connected_to_server.connect(_connected)
	tracker_client.message_received.connect(_on_data)

	# Initiate connection to the given URL.
	LOG.info("startup", {"name": ship_name(), "state": "init"})
	var err = tracker_client.connect_to_url(websocket_url)
	if err != OK:
		LOG.error("startup", {"name": ship_name(), "state": "failure"})
		set_process(false)

func _closed():
	LOG.info("closed", {"name": ship_name()})
	set_process(false)

func _connected():
	LOG.info("connected", {"name": ship_name(), "state": "success"})


func _on_data(message: Variant):
	var raw_message = JSON.parse_string(message)
	var addr_from = int(raw_message['addr_from'])
	
	var data = JSON.parse_string(raw_message["data"])
	if (data['type'] == 'offer'):
		LOG.info("offer_recieved", {"id": addr_from})
		clients[addr_from] = ConsoleConnection.new(tracker_client, addr_from)
		clients[addr_from].peer.set_remote_description("offer", data["sdp"])
		clients[addr_from].connect("established", _on_console_established)
		
	elif data['type'] == 'ice':
		LOG.info("ice_recieved", {"id": addr_from})
		var ice = data["candidate"]
		if ice == null:
			return # no more ice for now
		else:
			var client = clients.get(addr_from)
			if client == null:
				LOG.warn("ice_for_unknown_client", {"id": addr_from})
			else:
				clients[addr_from].peer.add_ice_candidate(
					ice['usernameFragment'],
					ice['sdpMLineIndex'],
					ice['candidate'],
				)
	else:
		LOG.error('unknown_message_from_tracker', {'data': data})
	

func _advertise_ship():
	_last_broadcast_time = Time.get_ticks_msec()
	tracker_client.send(JSON.stringify({
		"key": "HostingUpdate",
		"ship": {
			"name": ship_name(),
			"type": ship_type(),
		}
	}))
	

func _process(_delta):
	tracker_client.poll()
	
	var current_time = Time.get_ticks_msec()
	if current_time > BROADCAST_DELAY_MSEC + _last_broadcast_time:
		_advertise_ship()

	# Step any pending clients. 
	for client in clients:
		clients[client].iterate()

func _on_console_established(addr: int):
	LOG.info("console_ready", {"id": addr})
	var client = clients[addr]
	clients.erase(addr)
	
	var console = CONSOLE_SCENE.instantiate()
	console.setup(client)
	get_parent().add_child(console)
