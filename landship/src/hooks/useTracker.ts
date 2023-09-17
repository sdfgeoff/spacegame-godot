import { useEffect, useMemo, useState } from "react"
import { Tracker } from "../network/Tracker"
import { useAppContext } from "../contexts/AppContext"

/**
 * This hook constructs a connection to a tracker, and returns the tracker
 * instance and its state.
 * 
 * Probably you only want one of these in the app
 */
export const useTrackerInternal = (trackerUrl: string): {
    tracker: Tracker,
    trackerState: Tracker['state'],
} => {
    const tracker = useMemo(() => new Tracker(trackerUrl), [])
    const [trackerState, setTrackerState] = useState<Tracker['state']>('connecting')


    useEffect(() => {
        const handler = (state: Tracker['state']) => {
            setTrackerState(state)
        }
        return tracker.subscribeState(handler)
    }, [tracker])

    return {
        tracker,
        trackerState,
    }
}

export const useTracker = () => {
    const { tracker } = useAppContext()
    return tracker
}