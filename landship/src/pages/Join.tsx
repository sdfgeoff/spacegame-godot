import React, { useEffect, useState } from 'react'
import { Tracker } from '../network/Tracker'
import { GameDataResponse } from '../network/TrackerMessages'
import { FromRouterMessage, Topic } from '../models/Messages'
import { useServerTime } from '../hooks/useServerTime'
import { useAppContext } from '../contexts/AppContext'


export interface JoinProps {
    tracker: Tracker
    gameData: GameDataResponse
}



export const Join: React.FC<JoinProps> = () => {

    const {
        dataChannelConsole: {
            dataChannelConsole,
            dataChannelState,
        }
    } = useAppContext()
    
    
    const [latestMessage, setLatestMessage] = useState<FromRouterMessage<Topic> | undefined>(undefined)


    useEffect(() => {
        return dataChannelConsole.subscribeMessage((message) => {
            setLatestMessage(message)
        })
    }, [dataChannelConsole])



    const timingData = useServerTime()


    return (
        <div>
            <br />
            Connection state: {dataChannelState}
            <br />
            Timing data: {JSON.stringify(timingData)}
            <br />
            <br />
            Latest message: {JSON.stringify(latestMessage)}
        </div>
    )
}
