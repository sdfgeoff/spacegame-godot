extends RefCounted
"""
This is a utility topic that is not intended to be sent along the bus itself.
It is inteded to be used by intermediate translation nodes to pass along
information about what topics should be forwarded on.

Consider:
	Device -> WebRtcDataChannel -> Connector -> Router
The Connector can talk to the router and can subscribe to topics, but the
Device cannot directly communicate to the Router what it should be subscribed
to. To solve this issue and prevent the need for out-of-band-signallying,
this topic can be sent between the Device and Connector so that the connector
can subscribe to the necessary messages.

"""
var to_topics: Array
