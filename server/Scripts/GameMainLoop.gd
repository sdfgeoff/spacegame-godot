class_name GameMainLoop
extends SceneTree


func _process(_delta):
	call_group("post_frame", "_post_frame_1")
	call_group("post_frame", "_post_frame_2")
	call_group("post_frame", "_post_frame_3")
