import { useCallback, useEffect, useMemo, useState } from "react"
import { Tracker } from "../network/Tracker"
import { DataChannelConsole, DataChannelState } from "../network/DataChannelConsole"
import { FromRouterMessage, Topic } from "../models/Messages"
import { useAppContext } from "../contexts/AppContext"

type UnsubscribeFunction = () => void
type MessageHandler<T extends Topic> = (message: FromRouterMessage<T>) => void
type SubscribeToTopic = <T extends Topic>(topic: T, handler: MessageHandler<T>) => UnsubscribeFunction

interface TopicSubscription {
    uid: string,
    topic: Topic,
}


export interface DataChannelConsoleInternal {
    dataChannelConsole: DataChannelConsole,
    dataChannelState: DataChannelState,
    topicSubscriptions: TopicSubscription[],
    subscribeTopic: SubscribeToTopic,
}

/**
 * This hook constructs a connection to a tracker, and returns the tracker
 * instance and its state.
 * 
 * Probably you only want one of these in the app
 * 
 * @param tracker - The tracker instance.
 * @param trackerId - Which ship inside the tracker to connect to.
 */
export const useDataChannelConsoleInternal = (
    tracker: Tracker, 
    shipId: number | undefined
): DataChannelConsoleInternal => {

    const dataChannelConsole = useMemo(() => new DataChannelConsole(), [])

    const [connectionState, setConnectionState] = useState<DataChannelState>('connecting')
    const [topicSubscriptions, setTopicSubscriptions] = useState<TopicSubscription[]>([])
    
    useEffect(() => {
        if (!shipId) return
        dataChannelConsole.connect(shipId)
    }, [dataChannelConsole, shipId])

    useEffect(() => {
        return dataChannelConsole.setTracker(tracker)
    }, [dataChannelConsole, tracker])

    useEffect(() => {
        return dataChannelConsole.subscribeStateChange(setConnectionState)
    }, [dataChannelConsole])

    const subscribeTopic = useCallback(<T extends Topic>(topic: T, handler: MessageHandler<T>): UnsubscribeFunction => {
        const uid = Math.random().toString()
        setTopicSubscriptions((oldSubscriptions) => [...oldSubscriptions, { uid, topic }])
        
        const unsub = dataChannelConsole.subscribeMessage((message) => {
            if (message.message.topic === topic) {
                const m = message as unknown as FromRouterMessage<T>
                handler(m)
            }
        })

        return () => {
            unsub()
            setTopicSubscriptions((oldSubscriptions) => oldSubscriptions.filter((s) => s.uid !== uid))
        }
    }, [dataChannelConsole])

    const updateSubscriptions = useCallback(() => {
        const subs = topicSubscriptions.map((s) => s.topic)
        // deduplicate subscriptions
        const uniqueSubs = [...new Set(subs)]

        dataChannelConsole.send({
            message: {
                topic: 'Subscriptions',
                payload: {
                    to_topics: uniqueSubs
                }
            }
        })
    }, [dataChannelConsole, topicSubscriptions])

    useEffect(() => {
        updateSubscriptions()

        const interval = setInterval(updateSubscriptions, 1000)
        return () => clearInterval(interval)
    }, [updateSubscriptions])


    const consoleData = useMemo(() => ({
        dataChannelConsole,
        dataChannelState: connectionState,
        topicSubscriptions,
        subscribeTopic,
    }), [dataChannelConsole, connectionState, topicSubscriptions, subscribeTopic])

    return consoleData
}


export const useDataChannelConsole = (): DataChannelConsoleInternal => {
    const { dataChannelConsole } = useAppContext()
    return dataChannelConsole
    
}