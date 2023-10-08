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
