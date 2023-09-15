import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tracker } from '../network/Tracker'
import { DataChannelConsole } from '../network/DataChannelConsole'
import { GameDataResponse } from '../network/TrackerMessages'
import { DataChannelState } from '../network/DataChannelShared'
import { FromRouterMessage } from '../models/Messages'

export const Join: React.FC<{ tracker: Tracker, gameData: GameDataResponse }> = ({ tracker, gameData }) => {
    const dataChannelConsole = useMemo(() => new DataChannelConsole(), [])
    const gameTrackerId = useMemo(() => gameData.id, [gameData])

    const [connectionState, setConnectionState] = useState<DataChannelState>('connecting')

    const [latestMessage, setLatestMessage] = useState<FromRouterMessage | undefined>(undefined)

    useEffect(() => {
        return dataChannelConsole.subscribeMessage((message) => {
            setLatestMessage(message)
        })
    }, [dataChannelConsole])

    useEffect(() => {
        dataChannelConsole.connect(gameTrackerId)
    }, [dataChannelConsole, gameTrackerId])

    useEffect(() => {
        return dataChannelConsole.setTracker(tracker)
    }, [dataChannelConsole, tracker])

    useEffect(() => {
        return dataChannelConsole.subscribeStateChange(setConnectionState)
    }, [dataChannelConsole])

    const handleSend = (message: string) => {
        dataChannelConsole.send(
            {
                'message': {
                    topic: 'test',
                    payload: {
                        data: message
                    }
                }
            })
    }

    // We want to sync the clock by pinging the server regularly
    const pingServer = useCallback(() => {
        dataChannelConsole.send({
            'message': {
                topic: 'ping',
                payload: { time_ping_sent: performance.now() }
            }
        })
    }, [dataChannelConsole])

    useEffect(() => {
        const interval = setInterval(pingServer, 1000)
        return () => clearInterval(interval)
    }, [pingServer])



    return (
        <div>
            You are joining a game {JSON.stringify(gameData)}
            <br />
            Connection state: {connectionState}
            <br />
            <input type="text" onChange={(e) => handleSend(e.target.value)} />
            <button onClick={() => handleSend('send')}>Send</button>
            <br />
            Latest message: {JSON.stringify(latestMessage)}
        </div>
    )
}
