
# Message Types

# All
```
"""
Special topic. Not intended to be sent to anything, but is used for 
to indicate that something subscribes to .. everything.

ie: if you have a NetworkBus connection that subscribes to this topic
it will receive all (non addressed) packets regardless of what topic they
were sent to.
"""
extends RefCounted

```

# GNC_State
```
class_name GNC_State
"""
This packet contains information from the GNC (Guidance aNd Control) computer
that contains the current pose of the spacecraft in 3D space. 
"""
extends RefCounted

var time_sent: float

var pos_x: float
var pos_y: float
var pos_z: float

var ang_x: float
var ang_y: float
var ang_z: float



```

# GNC_Targets
```
class_name GNC_Targets
"""
Instructs the spacecraft to move, and at what speed and in what direction.
"""
extends RefCounted

var linear_x: float
var linear_y: float
var linear_z: float

var angular_x: float
var angular_y: float
var angular_z: float

```

# GNC_ThrusterCommand
```
class_name GNC_ThrusterCommand
"""
Issues commands to a single thruster to produce a particular amount of
thrust. 

This packet is intended to be addressed. Any thruster that subscribes to
this topic should ignore non-addressed packets to prevent unintentional
ship motion if a broadcast is accidentally sent.
"""
extends RefCounted

var target_thrust_newtons: float

```

# GNC_ThrusterState
```
class_name GNC_ThrusterState
"""
Describes a thruster, how it is mounted on the ship and now much thrust
it can apply. This is emitted by each thruter periodically and is intended
to be used to compute the flight dynamics and to figure out when the
thruster should be turned on.
"""
extends RefCounted

var mount: Transform3D
var max_thrust_newtons: float

```

# Ping
```
extends RefCounted
"""
A ping! This message can be sent onto a network bus to check that if a device
is connected. A properly configured ship will respond with a Pong event.

The Ping contains the send time, which the Pong will also contain. This
allows time-sync. For more information see the Pong documentation
"""
var time_ping_sent: int

```

# Pong
```
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

```

# Sensor_Objects
```
extends RefCounted
"""
Contains information about what devices the spaceship sensors can see.

The objects array contains a JSON dict of:
{
	designation: String,
	position: [float, float, float],
	time_last_seen: float
}

And the sensor_position contains the global position [float, float, float] of
the sensor.
"""

var objects: Array
var sensor_position: Array

```

# Subscriptions
```
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

```

# Weapons_LauncherState
```
extends RefCounted
"""
Information about a particular launcher/gun
"""

## What type of launcher is this? This generally indicates what type of
## ammunition it firest (Eg minigun, missile launcher)
var type: String

## What is this gun currently shooting at?
var current_target: String

## Is this gun currently engaging a target
var active: bool

## How many more rounds of ammunitino does this gun contain?
var ammo: int

```

# Weapons_LauncherTarget
```
extends RefCounted
"""
What target should this gun engage?
"""
var target_designation: String

```
