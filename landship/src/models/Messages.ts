/**
 * Messages sent between the subsystems of a spaceship. These can be subscribed to by
 * a console or other device.
 */
import { Message } from './MessageTypes'
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