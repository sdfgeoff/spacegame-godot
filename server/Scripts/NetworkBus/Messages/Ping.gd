extends RefCounted
"""
A ping! This message can be sent onto a network bus to check that if a device
is connected. A properly configured ship will respond with a Pong event.

The Ping contains the send time, which the Pong will also contain. This
allows time-sync. For more information see the Pong documentation
"""
var time_ping_sent: int
