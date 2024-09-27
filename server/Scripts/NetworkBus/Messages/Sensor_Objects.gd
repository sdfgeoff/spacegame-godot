class_name Sensor_Objects
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
