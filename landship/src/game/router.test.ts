import { Router } from './router';

describe('Simulated Router', () => {
    test('can subscribe to a topic', () => {
        const router = new Router();
        const node1 = router.createNode();
        const node2 = router.createNode();
        const node3 = router.createNode();

        node1.toRouter.push({
            message: {
                topic: 'subscriptions',
                payload: {
                    topic: ['test'],
                }
            }
        })

        node2.toRouter.push({
            message: {
                topic: 'test',
                payload: {
                    data: '1234',
                }
            }
        })
        
        router.iterate();

        expect(node1.fromRouter.length).toBe(1);
        expect(node1.fromRouter[0].message).toEqual(
            {
                    topic: 'test',
                    payload: {
                        data: '1234',
                    }
            }
        );

        expect(node2.fromRouter.length).toBe(0);
        expect(node3.fromRouter.length).toBe(0);
    })

    test('can unsubscribe from a topic', () => {
        const router = new Router();
        const node1 = router.createNode();
        const node2 = router.createNode();
        const node3 = router.createNode();

        node1.toRouter.push({
            message: {
                topic: 'subscriptions',
                payload: {
                    topic: ['test'],
                }
            }
        })

        node1.toRouter.push({
            message: {
                topic: 'subscriptions',
                payload: {
                    topic: [],
                }
            }
        })

        node2.toRouter.push({
            message: {
                topic: 'test',
                payload: {
                    data: '1234',
                }
            }
        })
        
        router.iterate();

        expect(node1.fromRouter.length).toBe(0);
        expect(node2.fromRouter.length).toBe(0);
        expect(node3.fromRouter.length).toBe(0);
    })

    test('can send a message to a specific address', () => {
        const router = new Router();
        const node1 = router.createNode();
        const node2 = router.createNode();

        // There isn't a method for a node to discover it's own address
        // so we have to grab it from the router
        const node2Address = 1; // We know this due to the order of creation

        node1.toRouter.push({
            address_to: node2Address,
            message: {
                topic: 'test',
                payload: {
                    data: '1234',
                }
            }
        })
        
        router.iterate();

        expect(node1.fromRouter.length).toBe(0);
        expect(node2.fromRouter.length).toBe(1);
    })

    test('pings come back', () => {
        const router = new Router();
        const node1 = router.createNode();

        node1.toRouter.push({
            message: {
                topic: 'ping',
                payload: {
                    time_sent: 1234,
                }
            }
        })

        router.iterate();

        expect(node1.fromRouter.length).toBe(1);
        expect(node1.fromRouter[0].message).toEqual(
            {
                topic: 'pong',
                payload: {
                    time_ping_sent: 1234,
                }
            }
        );
    })
})