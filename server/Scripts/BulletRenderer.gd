"""Singleton to create renderers"""
extends Node


# Called when the node enters the scene tree for the first time.
func _ready():
	add_child(preload("res://Effects/TracerRenderer.tscn").instantiate())
