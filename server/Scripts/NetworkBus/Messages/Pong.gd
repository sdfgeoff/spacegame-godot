extends RefCounted
"""
A response to a Ping message.

The Pong message contains two pieces of timing information:
 - The time the ping was sent (this is copied from the PING message)
 - The time that the server sent the pong

With these two numbers, the pinging device can:
 - Determine the ping time (time received vs time initially sent)
 - Adjust it's own clock to match the server time. If the network is symmetrical
   then the servers clock time when the pong is received will the `time_server_send + ping_duration / 2`
"""

var time_ping_sent: int
var time_server_send: int
