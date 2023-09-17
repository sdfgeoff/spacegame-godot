// A heading that displays some metadata...

import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Header: React.FC = () => {
        const { 
            tracker: {trackerState}, 
            dataChannelConsole: {
                dataChannelState
            },
            timingStats
        } = useAppContext()
    
    return (
        <div className="d-flex gap-2 p-1 bg-dark text-light">
            <div>Console State</div>

            {/* Tracker State */}
            {trackerState === 'connecting' && <div className="text-info">T: Connecting...</div>}
            {trackerState === 'connected' && <div>T: Ok</div>}
            {trackerState === 'disconnected' && <div className="text-warning">T: Disconnected</div>}
            {trackerState === 'error' && <div className="text-danger">T: Error</div>}

            {/* Data Channel State */}
            {dataChannelState === 'connecting' && <div className="text-info">C: Connecting...</div>}
            {dataChannelState === 'connected' && <div>C: Ok ({timingStats?.pingDuration.toFixed(0) ?? '?'}ms)</div>}
            {dataChannelState === 'disconnected' && <div className="text-warning">C: Disconnected</div>}
            {dataChannelState === 'error' && <div className="text-danger">C: Error</div>}
        </div>
    )
}