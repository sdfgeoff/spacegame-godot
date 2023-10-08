# Ship System Communication
##
A spaceship is composed of lots of discrete parts and these
parts all communicate with each other. They do so by sending packets
to each other using a network bus. This bus allows (eg) a sensor
module to send tergetting information to a gun, or a pilot's console
to send the desired motion to the GNC (guidance and navigation) computer.

Using a network-like system allows easy addition and integration of new
spaceship modules.

## So what is the NetworkBus?
The NetworkBus is a means of sending packets of data from one device to
another. It is unreliable - so data send may not arrive, and packets may not
arrive in order. 

The network bus has two addressing modes:
1. Publisher Subscriber
2. Addressed

The NetworkBus is largely a conceptual thing and is independent from implementation.
It describes *what* data is sent but does not describe *how*.
It is possible to connect a device to the NetworkBus locally to the Ship,
or via an external networking device (Eg Websockets, Serial, WebRTCDataChannel) 


### What is a BusConnection
A BusConnection attaches a device to the NetworkBus. It is 


### Routing
#### Publisher Subscriber Addressing
In many cases a message can be consumed by multiple devices on the network.
For example a sensor system that detects enemy spaceships needs to have
it's measurements sent to the weapons systems, to the tactical display,
to a mapping system etc. So there is a "topic" that these messages are
published to. Any other device on the network can then subscribe to this "topic"

This publisher-subscriber can also be used to help solve device discovery.
For example, all the weapons systems publish to the topic `Weapons_LauncherState`
with information describing the weapon. A console can then use that information
to display controls for that weapon.

There is the "special" topic called `All` which should *not* be used for
sending, but can be used to receive all non-addressed messages passing through
the network bus.

#### Addressed Addressing
Sometimes information needs to be specific to a single device. A spaceship
may have lots of thrusters, but if you want to rotate the spaceship at a
particular speed a different `GNC_ThrusterCommand` needs to be sent to 
each thruster. This is solved by addressing.

When a message is received by a BusConnection, it contains the address
that the message was received from. This address can then be used
to send a message at exactly that node. 

The simplest use case of this is a ping, which is used for time synchronization.
A device (eg a control console) sends a ping to the ship on the channel "Ping".
The ships clock then reads the address of the "Ping" and responds with a "Pong" addressed
at that exact node.

#### As Code
The routing rules are best expressed in pseudo code:
```
for message in all_messages:
    if message.address_to:
        get_device_by_address(message.address_to).send(message)
    
    for device in get_devices_subscribed_to(message.topic):
        device.send.append(message)

    for device in get_devices_subscribed_to_topic(ALL):
        device.inbox.append(message)
		
```
