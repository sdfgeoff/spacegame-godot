@tool
extends WorldEnvironment



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var material: ShaderMaterial = environment.sky.sky_material
	var activeViewport := get_viewport()
	var camera := activeViewport.get_camera_3d()
	var resolution = activeViewport.get_visible_rect().size
	var fov = deg_to_rad(camera.fov)

	if resolution != material.get_shader_parameter("SCREEN_RESOLUTION"):
		material.set_shader_parameter(
			"SCREEN_RESOLUTION", resolution
		)
	if fov != material.get_shader_parameter("FOV"):
		material.set_shader_parameter(
			"FOV",
			fov
		)
