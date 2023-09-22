import React, { useCallback, useEffect, useState } from 'react'
import { Tracker } from '../network/Tracker'
import { GameDataResponse } from '../network/TrackerMessages'
import { FromRouterMessage, Topic } from '../models/Messages'
import { useServerTime } from '../hooks/useServerTime'
import { useAppContext } from '../contexts/AppContext'
import JoyPad, { Position } from '../components/Joypad'


export interface JoinProps {
    tracker: Tracker
    gameData: GameDataResponse
}



export const Join: React.FC<JoinProps> = () => {

    const {
        dataChannelConsole: {
            dataChannelConsole,
            dataChannelState,
            subscribeTopic
        }
    } = useAppContext()
    
    
    const [latestMessage, setLatestMessage] = useState<FromRouterMessage<Topic> | undefined>(undefined)

    useEffect(() => {
        return subscribeTopic("GNC_State", (message) => {
            console.log(message)
        })

    }, [subscribeTopic])

    // useEffect(() => {
    //     return dataChannelConsole.subscribeMessage((message) => {
    //         setLatestMessage(message)
    //     })
    // }, [dataChannelConsole])

    const onPositionChange = useCallback((position: Position) => {
        dataChannelConsole.send({
            message: {
            topic: "GNC_Targets",
            payload: {
                linear_x: position.x,
                linear_y: position.y,
                linear_z: 0,
                angular_x: 0,
                angular_y: 0,
                angular_z: 0,
            }}

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
            <JoyPad onPositionChange={onPositionChange}/>
        </div>
    )
}
