class_name ConsoleConnection
extends Node

var peer: WebRTCPeerConnection
var channel: WebRTCDataChannel
var remote_channel: WebRTCDataChannel

var _signaling: WebSocketClient
var _signalling_remote_id: int

func _init(signaling: WebSocketClient, signalling_remote_id: int):
	_signaling = signaling
	_signalling_remote_id = signalling_remote_id
	peer = WebRTCPeerConnection.new()
	peer.initialize({
		"iceServers": [
			{ "urls": "stun:stun4.l.google.com:19302" },
			{ "urls": "stun:stun.3cx.com" }
		],
	})
	channel = peer.create_data_channel("chat", {"maxRetransmits": 0, "ordered": true})
	peer.ice_candidate_created.connect(_on_ice_candidate)
	peer.session_description_created.connect(_on_session)
	peer.data_channel_received.connect(_on_datacannel_recieved)
	
func _on_datacannel_recieved(r_channel: WebRTCDataChannel):
	#channel.connect("")
	remote_channel = r_channel
	print("Got it!", remote_channel)


func _on_ice_candidate(media: String, index: int, nam: String):
	_signaling.send(JSON.stringify({
		"addr_to": _signalling_remote_id,
		"key": "MessageRequest",
		"data": JSON.stringify({
			"type": "ice",
			"candidate": {
				"candidate": nam,
				"sdpMid": media,
				"sdpMLineIndex": index,
			}
		})
	}))
	# Send the ICE candidate to the other peer via signaling server
	#signaling.send_candidate(get_path(), mid, index, sdp)

func _on_session(type, sdp):
	_signaling.send(JSON.stringify({
		"addr_to": _signalling_remote_id,
		"key": "MessageRequest",
		"data": JSON.stringify({
			"type": type,
			"sdp": sdp
		})
	}))
	peer.set_local_description(type, sdp)

func _process(_delta):
	# Always poll the connection frequently
	peer.poll()
	channel.poll()
	if channel.get_ready_state() == WebRTCDataChannel.STATE_OPEN:
		while channel.get_available_packet_count() > 0:
			print(get_path(), " received: ", channel.get_packet().get_string_from_utf8())
	
	if remote_channel != null:
		remote_channel.poll()
		if remote_channel.get_ready_state() == WebRTCDataChannel.STATE_OPEN:
			while channel.get_available_packet_count() > 0:
				print(get_path(), " received: ", channel.get_packet().get_string_from_utf8())

func send_message(message):
	channel.put_packet(message.to_utf8_buffer())
	if remote_channel != null:
		remote_channel.put_packet(message.to_utf8_buffer())
