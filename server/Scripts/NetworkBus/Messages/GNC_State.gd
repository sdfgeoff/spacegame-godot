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


