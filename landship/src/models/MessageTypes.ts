
// Autogenerated File. Do not edit
// Instead modify the files inside server/Scripts/NetworkBus/Messages

export interface AllMessage {
	topic: 'All';
	payload: {

	};
}

export interface GNC_StateMessage {
	topic: 'GNC_State';
	payload: {
		time_sent: number;
		pos_x: number;
		pos_y: number;
		pos_z: number;
		ang_x: number;
		ang_y: number;
		ang_z: number
	};
}

export interface GNC_TargetsMessage {
	topic: 'GNC_Targets';
	payload: {
		linear_x: number;
		linear_y: number;
		linear_z: number;
		angular_x: number;
		angular_y: number;
		angular_z: number
	};
}

export interface GNC_ThrusterCommandMessage {
	topic: 'GNC_ThrusterCommand';
	payload: {
		target_thrust_newtons: number
	};
}

export interface GNC_ThrusterStateMessage {
	topic: 'GNC_ThrusterState';
	payload: {
		mount: Transform3D;
		max_thrust_newtons: number
	};
}

export interface PingMessage {
	topic: 'Ping';
	payload: {
		time_ping_sent: number
	};
}

export interface PongMessage {
	topic: 'Pong';
	payload: {
		time_ping_sent: number;
		time_server_send: number
	};
}

export interface Sensor_ObjectsMessage {
	topic: 'Sensor_Objects';
	payload: {
		objects: Array;
		sensor_position: Array
	};
}

export interface SubscriptionsMessage {
	topic: 'Subscriptions';
	payload: {
		to_topics: Array
	};
}

export interface Weapons_LauncherStateMessage {
	topic: 'Weapons_LauncherState';
	payload: {
		type: string;
		current_target: string;
		active: boolean;
		ammo: number
	};
}

export interface Weapons_LauncherTargetMessage {
	topic: 'Weapons_LauncherTarget';
	payload: {
		target_designation: string
	};
}

export type Message = AllMessage | GNC_StateMessage | GNC_TargetsMessage | GNC_ThrusterCommandMessage | GNC_ThrusterStateMessage | PingMessage | PongMessage | Sensor_ObjectsMessage | SubscriptionsMessage | Weapons_LauncherStateMessage | Weapons_LauncherTargetMessage
