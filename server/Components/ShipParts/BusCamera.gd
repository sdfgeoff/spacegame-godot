extends Node3D

var active = false
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta):
	$Viewport/Camera3D.global_transform = global_transform
	if (!active):
		$Viewport.render_target_update_mode = $Viewport.UPDATE_DISABLED
		return
	$Viewport.render_target_update_mode = $Viewport.UPDATE_ONCE

	# Retrieve the captured Image using get_image().
	var img: Image = $Viewport.get_texture().get_image()
	# Flip on the Y axis.
	# You can also set "V Flip" to true if not on the root Viewport.
	img.flip_y()
	# Convert Image to ImageTexture.
	img.save_jpg("/home/geoffrey/test.jpg")
