""" 
Connects to the tracker and publishes the existence of this ship. 
When a connection is established, creates a child component with the connection.
"""
extends Node

var LOG = Log.new("console_tracker")

# The URL we will connect to
const websocket_url = "ws://0.0.0.0:%d" % ConsoleTracker.PORT

var _last_broadcast_time = 0
const BROADCAST_DELAY_MSEC = 5000

# Our WebSocketClient instance
var tracker_client = WebSocketClient.new()
var clients = {}


func ship_name():
	return get_parent().name

func _ready():
	# Connect base signals to get notified of connection open, close, and errors.
	tracker_client.connection_closed.connect(_closed)
	tracker_client.connected_to_server.connect(_connected)
	# This signal is emitted when not using the Multiplayer API every time
	# a full packet is receihtopved.
	# Alternatively, you could check get_peer(1).get_available_packets() in a loop.
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
		
	elif data['type'] == 'ice':
		LOG.info("ice_recieved", {"id": addr_from})
		var ice = data["candidate"]
		if ice == null:
			return # no more ice for now
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
		"game": {
			"name": ship_name()
		}
	}))
	

func _process(delta):
	# Call this in _process or _physics_process. Data transfer, and signals
	# emission will only happen when calling this function.
	tracker_client.poll()
	
	var current_time = Time.get_ticks_msec()
	if current_time > BROADCAST_DELAY_MSEC + _last_broadcast_time:
		_advertise_ship()
		
		for client in clients:
			clients[client].send_message(JSON.stringify({"test": "tester"}))

	for client in clients:
		clients[client]._process(delta)
