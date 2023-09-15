// A heading that displays some metadata...

import React from 'react';
import { GameMode } from '../models/GameMode';
import { TrackerState } from '../network/Tracker';

export const Header: React.FC<{trackerState: TrackerState, gameMode: GameMode}> = ({trackerState, gameMode}) => {
    return (
        <div className="d-flex gap-2 p-1 bg-dark text-light">
            <div>Console State</div>

            {/* Tracker State */}
            {trackerState === 'connecting' && <div className="text-info">T: Connecting...</div>}
            {trackerState === 'connected' && <div>T: Ok</div>}
            {trackerState === 'disconnected' && <div className="text-warning">T: Disconnected</div>}
            {trackerState === 'error' && <div className="text-danger">T: Error</div>}
        </div>
    )
}