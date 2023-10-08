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
