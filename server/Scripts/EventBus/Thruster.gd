extends CollisionShape3D

@export var flames: Array[NodePath] = []
@export var max_thrust: float = 10.0


# Nodes that can apply force to the ship
var flame_nodes: Array[MeshInstance3D] = []
var connection_nodes: Array[BusConnection] = []

# What this thruster applies force to
var root_body: RigidBody3D

const NOTIFICATION_TIME_SECONDS: float = 1.0;
var last_notify_time: float = 0.0;

var targets: Array[GNC_ThrusterCommand] = []


# Called when the node enters the scene tree for the first time.
func _ready():
	for id in len(flames):
		var flamePath = flames[id]
		var flame = get_node(flamePath)
		flame_nodes.append(flame)
		var busConnect = BusConnection.new()
		busConnect.name = "FlameConnect: %s" % flame.name
		add_child(busConnect)
		connection_nodes.append(busConnect)
		
		var handleMessage = func(message: Message):
			on_message(id, message)
		
		busConnect.connect("got_message", handleMessage)
		
		targets.append(Payload.create_gnc_thrustercommand(0))

	root_body = get_parent()
	

	

func on_message(id: int, message: Message):
	if message.topic == Payload.Topic.GNC_THRUSTERCOMMAND and message.address_to != null:  # Must be specifically at this thruster
		targets[id] = message.data


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float):
	last_notify_time += delta
	if last_notify_time > NOTIFICATION_TIME_SECONDS:
		last_notify_time -= NOTIFICATION_TIME_SECONDS
		
		for id in len(flame_nodes):
			var flame := flame_nodes[id]
			var connection := connection_nodes[id]
			var relativeTransform = transform * flame.transform
			connection.queue_message(
				Payload.Topic.GNC_THRUSTERSTATE,
				Payload.create_gnc_thrusterstate(
					relativeTransform,
					max_thrust
				)
			)
	
	for id in len(flame_nodes):
		var flame := flame_nodes[id]
		var target := targets[id]
		var percent = clampf(target.target_thrust_newtons / max_thrust, 0, 1)
		var relativeTransform := transform * flame.transform
		
		root_body.apply_force(
			relativeTransform.basis.y * percent * -max_thrust,
			relativeTransform.origin,
		)
		flame.set_instance_shader_parameter('output_percent', percent)
