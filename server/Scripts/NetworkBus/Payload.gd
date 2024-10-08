class_name Payload
# WARNING: AutoGenerated File. Do Not Modify
# Instead modify the files inside server/Scripts/NetworkBus/Messages
	
const All = preload('res://Scripts/NetworkBus/Messages/All.gd')
const GNC_State = preload('res://Scripts/NetworkBus/Messages/GNC_State.gd')
const GNC_Targets = preload('res://Scripts/NetworkBus/Messages/GNC_Targets.gd')
const GNC_ThrusterCommand = preload('res://Scripts/NetworkBus/Messages/GNC_ThrusterCommand.gd')
const GNC_ThrusterState = preload('res://Scripts/NetworkBus/Messages/GNC_ThrusterState.gd')
const Ping = preload('res://Scripts/NetworkBus/Messages/Ping.gd')
const Pong = preload('res://Scripts/NetworkBus/Messages/Pong.gd')
const Sensor_Objects = preload('res://Scripts/NetworkBus/Messages/Sensor_Objects.gd')
const Subscriptions = preload('res://Scripts/NetworkBus/Messages/Subscriptions.gd')
const Weapons_LauncherInfo = preload('res://Scripts/NetworkBus/Messages/Weapons_LauncherInfo.gd')
const Weapons_LauncherState = preload('res://Scripts/NetworkBus/Messages/Weapons_LauncherState.gd')
const Weapons_LauncherTarget = preload('res://Scripts/NetworkBus/Messages/Weapons_LauncherTarget.gd')

enum Topic {
	ALL,
	GNC_STATE,
	GNC_TARGETS,
	GNC_THRUSTERCOMMAND,
	GNC_THRUSTERSTATE,
	PING,
	PONG,
	SENSOR_OBJECTS,
	SUBSCRIPTIONS,
	WEAPONS_LAUNCHERINFO,
	WEAPONS_LAUNCHERSTATE,
	WEAPONS_LAUNCHERTARGET,
}

const TOPIC_TO_STRING = {
	Topic.ALL: "All",
	Topic.GNC_STATE: "GNC_State",
	Topic.GNC_TARGETS: "GNC_Targets",
	Topic.GNC_THRUSTERCOMMAND: "GNC_ThrusterCommand",
	Topic.GNC_THRUSTERSTATE: "GNC_ThrusterState",
	Topic.PING: "Ping",
	Topic.PONG: "Pong",
	Topic.SENSOR_OBJECTS: "Sensor_Objects",
	Topic.SUBSCRIPTIONS: "Subscriptions",
	Topic.WEAPONS_LAUNCHERINFO: "Weapons_LauncherInfo",
	Topic.WEAPONS_LAUNCHERSTATE: "Weapons_LauncherState",
	Topic.WEAPONS_LAUNCHERTARGET: "Weapons_LauncherTarget",
}

const STRING_TO_TOPIC = {
	"All": Topic.ALL,
	"GNC_State": Topic.GNC_STATE,
	"GNC_Targets": Topic.GNC_TARGETS,
	"GNC_ThrusterCommand": Topic.GNC_THRUSTERCOMMAND,
	"GNC_ThrusterState": Topic.GNC_THRUSTERSTATE,
	"Ping": Topic.PING,
	"Pong": Topic.PONG,
	"Sensor_Objects": Topic.SENSOR_OBJECTS,
	"Subscriptions": Topic.SUBSCRIPTIONS,
	"Weapons_LauncherInfo": Topic.WEAPONS_LAUNCHERINFO,
	"Weapons_LauncherState": Topic.WEAPONS_LAUNCHERSTATE,
	"Weapons_LauncherTarget": Topic.WEAPONS_LAUNCHERTARGET,
}

static func create_all() -> All:
	var message = All.new()

	return message

static func create_gnc_state(time_sent: float, pos: Array, quat: Array) -> GNC_State:
	var message = GNC_State.new()
	message.time_sent = time_sent
	message.pos = pos
	message.quat = quat
	return message

static func create_gnc_targets(linear_x: float, linear_y: float, linear_z: float, angular_x: float, angular_y: float, angular_z: float) -> GNC_Targets:
	var message = GNC_Targets.new()
	message.linear_x = linear_x
	message.linear_y = linear_y
	message.linear_z = linear_z
	message.angular_x = angular_x
	message.angular_y = angular_y
	message.angular_z = angular_z
	return message

static func create_gnc_thrustercommand(target_thrust_newtons: float) -> GNC_ThrusterCommand:
	var message = GNC_ThrusterCommand.new()
	message.target_thrust_newtons = target_thrust_newtons
	return message

static func create_gnc_thrusterstate(mount: Transform3D, max_thrust_newtons: float) -> GNC_ThrusterState:
	var message = GNC_ThrusterState.new()
	message.mount = mount
	message.max_thrust_newtons = max_thrust_newtons
	return message

static func create_ping(time_ping_sent: int) -> Ping:
	var message = Ping.new()
	message.time_ping_sent = time_ping_sent
	return message

static func create_pong(time_ping_sent: int, time_server_send: int) -> Pong:
	var message = Pong.new()
	message.time_ping_sent = time_ping_sent
	message.time_server_send = time_server_send
	return message

static func create_sensor_objects(objects: Array, sensor_position: Array) -> Sensor_Objects:
	var message = Sensor_Objects.new()
	message.objects = objects
	message.sensor_position = sensor_position
	return message

static func create_subscriptions(to_topics: Array) -> Subscriptions:
	var message = Subscriptions.new()
	message.to_topics = to_topics
	return message

static func create_weapons_launcherinfo(type: String) -> Weapons_LauncherInfo:
	var message = Weapons_LauncherInfo.new()
	message.type = type
	return message

static func create_weapons_launcherstate(current_target: String, state: String, ammo: int) -> Weapons_LauncherState:
	var message = Weapons_LauncherState.new()
	message.current_target = current_target
	message.state = state
	message.ammo = ammo
	return message

static func create_weapons_launchertarget(target_designation: String) -> Weapons_LauncherTarget:
	var message = Weapons_LauncherTarget.new()
	message.target_designation = target_designation
	return message

const TOPIC_TO_TYPE = {
	Topic.ALL: All,
	Topic.GNC_STATE: GNC_State,
	Topic.GNC_TARGETS: GNC_Targets,
	Topic.GNC_THRUSTERCOMMAND: GNC_ThrusterCommand,
	Topic.GNC_THRUSTERSTATE: GNC_ThrusterState,
	Topic.PING: Ping,
	Topic.PONG: Pong,
	Topic.SENSOR_OBJECTS: Sensor_Objects,
	Topic.SUBSCRIPTIONS: Subscriptions,
	Topic.WEAPONS_LAUNCHERINFO: Weapons_LauncherInfo,
	Topic.WEAPONS_LAUNCHERSTATE: Weapons_LauncherState,
	Topic.WEAPONS_LAUNCHERTARGET: Weapons_LauncherTarget,
}
