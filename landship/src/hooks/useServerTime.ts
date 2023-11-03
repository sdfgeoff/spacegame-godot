import {useCallback, useEffect, useState} from "react";
import { DataChannelConsole } from "../network/DataChannelConsole";
import { useAppContext } from "../contexts/AppContext";
import { DataChannelConsoleInternal } from "./useDataChannelConsole";

export interface TimingStats {
    pingDuration: number
    clockOffset: number
}

const CLOCK_OFFSET_DAMPING = 0.1

const PING_INTERVAL_MSEC = 1000


export const usePingShip = (dataChannelConsole: DataChannelConsole | undefined) => {
    // Ping the server regularly
    const pingServer = useCallback(() => {
        if (!dataChannelConsole) return
        dataChannelConsole.send({
            'message': {
                topic: 'Ping',
                payload: { time_ping_sent: performance.now() }
            }
        })
    }, [dataChannelConsole])


    useEffect(() => {
        const interval = setInterval(pingServer, PING_INTERVAL_MSEC)
        return () => clearInterval(interval)
    }, [pingServer])
}


export const useTimingStatsInternal = (dataChannelConsole: DataChannelConsoleInternal): TimingStats | undefined => {
    const [timingStats, setTimingStats] = useState<TimingStats | undefined>(undefined)    

    useEffect(() => {
        return dataChannelConsole.subscribeTopic('Pong', (message) => {
                const pong = message.message.payload
                setTimingStats((oldStats) => {

                    const timeNow = performance.now()
                    const pingDuration = timeNow - pong.time_ping_sent
                    const clockOffset = timeNow - pong.time_server_send - pingDuration / 2

                    const newClockOffset = oldStats?.clockOffset ?
                        oldStats.clockOffset * (1 - CLOCK_OFFSET_DAMPING) + clockOffset * CLOCK_OFFSET_DAMPING :
                        clockOffset

                    return { pingDuration, clockOffset: newClockOffset }
                })
        })
    }, [dataChannelConsole.subscribeTopic])

    return timingStats
}



export const useServerTime = () => {
    const { timingStats } = useAppContext()

    return {
        pingDuration: timingStats?.pingDuration,
        monatomicTime: performance.now() / 1000,
        currentServerTime: timingStats?.clockOffset ? (performance.now() - timingStats.clockOffset) / 1000 : undefined
    }
}