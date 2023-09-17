import React from 'react';
import { Tracker } from '../network/Tracker';
import { DataChannelConsoleInternal } from '../hooks/useDataChannelConsole';

export interface AppContextType {
    tracker: {
        tracker: Tracker,
        trackerState: string,
    },
    dataChannelConsole: DataChannelConsoleInternal
    timingStats: {
        pingDuration: number
        clockOffset: number
    } | undefined
}

export const AppContext = React.createContext<AppContextType | null>(null);


export const useAppContext = () => {
    const context = React.useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider')
    }
    return context
}
