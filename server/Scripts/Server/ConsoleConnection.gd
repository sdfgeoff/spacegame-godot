class_name ConsoleConnection
extends Node

var peer: WebRTCPeerConnection
var toConsole: WebRTCDataChannel
var toServer: WebRTCDataChannel

var _signaling: WebSocketClient
var _signalling_remote_id: int


signal messageFromConsole(data: String)
signal established(addr: int)
signal disconnect()

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
	toConsole = peer.create_data_channel("chat", {"maxRetransmits": 0, "ordered": true})
	peer.ice_candidate_created.connect(_on_ice_candidate)
	peer.session_description_created.connect(_on_session)
	peer.data_channel_received.connect(_on_datacannel_recieved)
	
	add_to_group("post_frame")
	
func _on_datacannel_recieved(r_channel: WebRTCDataChannel):
	toServer = r_channel
	established.emit(_signalling_remote_id)

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


func iterate():
	peer.poll()
	toConsole.poll()
	
	if toConsole.get_ready_state() == WebRTCDataChannel.STATE_CLOSED:
		emit_signal("disconnect")

	if toServer != null:
		toServer.poll()
		var readyState = toServer.get_ready_state()
		if readyState == WebRTCDataChannel.STATE_OPEN:
			while toServer.get_available_packet_count() > 0:
				messageFromConsole.emit(toServer.get_packet().get_string_from_utf8())
		elif readyState == WebRTCDataChannel.STATE_CLOSED:
			emit_signal("disconnect")


func _post_frame_2():
	# Always poll the connection frequently
	iterate()
	


func sendMessageToConsole(message):
	if toConsole.get_ready_state() == toConsole.ChannelState.STATE_OPEN:
		toConsole.put_packet(message.to_utf8_buffer())
	
