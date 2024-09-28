class_name GNC_State
"""
This packet contains information from the GNC (Guidance aNd Control) computer
that contains the current pose of the spacecraft in 3D space. 
"""
extends RefCounted

var time_sent: float

var pos: Array
var quat: Array
