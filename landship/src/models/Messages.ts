/**
 * Messages sent between the subsystems of a spaceship. These can be subscribed to by
 * a console or other device.
 */


/**
 * Intended for use for automated tests.  Not used in the game itself.
 */
export interface TestMessage {
    topic: 'test';
    payload: {
        data: string;
    };
}

/**
 * Ping message used to synchronize clocks between the console and the ship.
 */
export interface PingMessage {
    topic: 'ping';
    payload: {
        time_sent: number;
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

export type Message = TestMessage | PingMessage | PongMessage | SubscriptionsMessage;
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