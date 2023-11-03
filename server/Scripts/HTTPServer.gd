"""
The HTTPServer is a normal web server hosted by the game. It is used to:
	- Host game static content (eg the HTML files used to serve the game)
	- Communicate bulk data to a game client (Eg meshes, textures)
	
It is not really part of the in-world simulation, but information transmitted
on the ships network bus may reference it.
"""
extends Node

var PORT: int = ProjectSettings.get_setting("network/webserver/port", null)
var STATIC_BUNDLE: String = "res://web_bundle.zip"

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
