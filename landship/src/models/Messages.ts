/**
 * Messages sent between the subsystems of a spaceship. These can be subscribed to by
 * a console or other device.
 */


/**
 * Ping message used to synchronize clocks between the console and the ship.
 */
export interface PingMessage {
    topic: 'ping';
    payload: {
        time_ping_sent: number;
    };
}

/**
 * Pong message used to synchronize clocks between the console and the ship.
 * Sent in response to a ping message.
 */
export interface PongMessage {
    topic: 'pong';
    payload: {
        time_ping_sent: number;
        time_server_recieved: number;
    };
}

/**
 * Message sent to the ship to subscribe to a topic.
 */
export interface SubscriptionsMessage {
    topic: 'subscriptions';
    payload: {
        topic: Topic[];
    };
}

export type Message = PingMessage | PongMessage | SubscriptionsMessage;
export type Topic = Message["topic"];

export type Address = number;

export type FromRouterMessage = {
    address_from: Address,
    message: Message,
}

export type ToRouterMessage = {
    address_to?: Address,
    message: Message,
}