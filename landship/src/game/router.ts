/**
 * The router simulates the internal networking of a single spaceship.
 * 
 * It is responsible for routing messages to the correct subsystems, and it does so by
 * implementing two addressing modes:
 *  - Publisher Subscriber
 *  - Direct Address
 * 
 * If you know the exact address of a device, you can send it a message directly.
 * If you don't know the exact address, you can send a message to a group of devices.
 * 
 * If you just want to listen to a group of devices, you can subscribe to a topic.
 */
import { Message, Topic, FromRouterMessage, ToRouterMessage, Address } from "../models/Messages";
import { MessageFromServer } from "../network/TrackerMessages";


export class Node {
    fromRouter: FromRouterMessage[] = []
    toRouter: ToRouterMessage[] = []
}


const _clearArray = <T>(arr: T[]) => {
    arr.splice(0, arr.length);
}
const _setArray = <T>(arr: T[], items: T[]) => {
    _clearArray(arr);
    arr.push(...items);
}



type RouterInternalMessage = ToRouterMessage & {
    address_from: Address,
}

export class Router {

    nextAddress: Address = 0;

    nodes: Map<Address, {
        node: Node,
        topics: Topic[],
    }> = new Map();

    subscriptionTable: Map<Topic, Node[]> = new Map();


    createNode = () => {
        const address = this.nextAddress;
        this.nextAddress += 1;
        const node = new Node();
        this.nodes.set(address, {
            node,
            topics: [],
        });
        return node;
    }


    _subscriptionsChanged = (address: Address, newTopics: Topic[]) => {
        const nodeData = this.nodes.get(address);
        if (!nodeData) {
            return;
        }
        const { node, topics: existingTopics } = nodeData;

        const toRemove = existingTopics?.filter((topic) => !newTopics.includes(topic));
        const toAdd = newTopics.filter((topic) => !existingTopics?.includes(topic));

        // Remove old subscriptions from the subscription table
        toRemove?.forEach((topic) => {
            const nodes = this.subscriptionTable.get(topic);
            if (nodes) {
                const index = nodes.indexOf(node);
                if (index !== -1) {
                    nodes.splice(index, 1);
                }
            }
        });

        // Add new subscriptions to the subscription table
        toAdd.forEach((topic) => {
            const nodes = this.subscriptionTable.get(topic);
            if (nodes) {
                nodes.push(node);
            } else {
                this.subscriptionTable.set(topic, [node]);
            }
        });

        _setArray(existingTopics, newTopics);
    }

    iterate = () => {
        // Get messages from the toRouter of all nodes
        const allMessages: RouterInternalMessage[] = [];

        this.nodes.forEach(({ node }, address) => {
            node.toRouter.forEach((message) => {
                allMessages.push({
                    ...message,
                    address_from: address,
                });
            });
            node.toRouter.splice(0, node.toRouter.length);
        });

        // Now handle any subscription change messages
        allMessages.forEach((message) => {
            if (message.message.topic === 'subscriptions') {
                const { topic } = message.message.payload;
                this._subscriptionsChanged(message.address_from, topic);
            }
        })

        // We handle non-addressed pings in-router, turning them into addressed pongs
        const allMessagesAsPongs: RouterInternalMessage[] = allMessages.map((message) => {
            if (message.message.topic === 'ping' && !message.address_to) {
                const { time_sent } = message.message.payload;
                const pongMessage: Message = {
                    topic: 'pong',
                    payload: {
                        time_ping_sent: time_sent,
                    }
                }
                return {
                    address_from: -1,
                    address_to: message.address_from,
                    message: pongMessage,
                }
            }
            return message;
        })

        // Now we can route all the messages
        allMessagesAsPongs.forEach((message) => {
            const { address_to, message: msg } = message;
            if (address_to !== undefined) {
                // If specfic target address, send it there
                const node = this.nodes.get(address_to)?.node;
                if (node) {
                    node.fromRouter.push({
                        address_from: message.address_from,
                        message: msg,
                    });
                }
            } else {
                // Otherwise, send it to all nodes that are subscribed to the topic
                const nodes = this.subscriptionTable.get(msg.topic);
                nodes?.forEach((node) => {
                    node.fromRouter.push({
                        address_from: message.address_from,
                        message: msg,
                    });
                }
                );
            }
        })
    }
}
