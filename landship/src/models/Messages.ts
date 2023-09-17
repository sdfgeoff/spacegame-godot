/**
 * Messages sent between the subsystems of a spaceship. These can be subscribed to by
 * a console or other device.
 */
import { Message } from './MessageTypes'
export type Topic = Message["topic"];

export type MessageWithTopic<T extends Topic> = Extract<Message, { topic: T }>


export type Address = number;

export type FromRouterMessage<T extends Topic> = {
    address_from: Address,
    message: MessageWithTopic<T>,
}

export type ToRouterMessage<T extends Topic> = {
    address_to?: Address,
    message: MessageWithTopic<T>,
}