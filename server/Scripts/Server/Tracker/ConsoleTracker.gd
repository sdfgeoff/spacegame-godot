""" A Signalling Server used to allow external clients to detect what ships are available.
"""
extends Node
var LOG = Log.new("console_tracker")

# The port we will listen to
const PORT = 42425
# Our WebSocketServer instance
var _server = WebSocketServer.new()



var AVAILABLE_SHIPS = []



var pending_messages: Array[String] = []



func _ready():
	# Connect base signals to get notified of new client connections,
	# disconnections, and disconnect requests.
	_server.client_connected.connect(_connected)
	_server.client_disconnected.connect(_disconnected)

	# This signal is emitted when not using the Multiplayer API every time a
	# full packet is received.
	# AlternativelTy, you could check get_peer(PEER_ID).get_available_packets()
	# in a loop for each connected peer.
	_server.message_received.connect(_on_data)
	# Start listening on the given port.
	var err = _server.listen(PORT)
	if err != OK:
		LOG.error("startup_failed", {})
		set_process(false)
	LOG.info("startup_success", {"port":PORT})

func _connected(id):
	# This is called when a new peer connects, "id" will be the assigned peer id,
	# "proto" will be the selected WebSocket sub-protocol (which is optional)
	LOG.info("client_connected", {"id": id})


func _remove_ship_hosted_by_id(id: int):
	AVAILABLE_SHIPS = AVAILABLE_SHIPS.filter(
		func(ship):
			return ship['id'] != id
	)
	


func _disconnected(id, _was_clean = false):
	# This is called when a client disconnects, "id" will be the one of the
	# disconnecting client, "was_clean" will tell you if the disconnection
	# was correctly notified by the remote peer before closing the socket.
	_remove_ship_hosted_by_id(id)
	LOG.info("client_disconnected", {"id": id})

func _on_data(id, message):
	# Print the received packet, you MUST always use get_peer(id).get_packet to receive data,
	# and not get_packet directly when not using the MultiplayerAPI.
	var data = JSON.parse_string(message)
	match data["key"]: 
		"ListRequest":
			# List Request, return the currently available games
			_server.send(id, JSON.stringify({
				"key": "ListResponse",
				"games": AVAILABLE_SHIPS,
			}))
		"HostingUpdate":
			var newGameData = {
				"id": id,
				"game": {
					"name": data["game"]["name"],
				}
			}
			_remove_ship_hosted_by_id(id)
			AVAILABLE_SHIPS.append(newGameData)
			LOG.info("hosting_update", {"id": id})
		"MessageRequest":
			# Pass message to another peer
			var target = int(data["addr_to"])
			if _server.peers.has(target):
				_server.send(target, JSON.stringify({
					"key": "MessageResponse",
					"addr_from": id,
					"data": data["data"]
				}))
				LOG.info("forwarding_message", {"from": id, "to": target})
			else:
				_server.send(id, JSON.stringify({
					"key": "ErrorResponse",
					"details": "Unknown Peer Id"
				}))
				LOG.warn("forwarding_message_unknown_peer", {"from": id, "to": target})
		_:
			print("Unknown Message Type from %d: %s", [id, data["key"]])
			_server.send(id, JSON.stringify({
				"key": "ErrorResponse",
				"details": "Unknown Message Type"
			}))


func _process(_delta):
	# Call this in _process or _physics_process.
	# Data transfer, and signals emission will only happen when calling this function.
	_server.poll()
