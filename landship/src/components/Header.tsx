// A heading that displays some metadata...

import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Panel } from './Panel';
import Button from './Button';

export const Header: React.FC<
    {
        returnToShipSelector: () => void
    }
> = ({returnToShipSelector}) => {
    const {
        tracker: { trackerState },
        dataChannelConsole: {
            dataChannelState
        },
        timingStats,
        gameMode,
    } = useAppContext()

    return (
        <Panel variant="dark" className="d-flex align-items-stretch p-05">
            <Panel variant="dark" className="px-1"><h1>
                {gameMode.mode === 'home' && 'Ship Selector'}
                {gameMode.mode === 'play' && gameMode.gameData.game.name}
            </h1></Panel>

            {/* Tracker State */}
            <small className="d-flex flex-column justify-content-stretch">
                {trackerState === 'connecting' && <Panel variant="info" className="px-1">Tracker: Connecting...</Panel>}
                {trackerState === 'connected' && <Panel variant="dark" className="px-1">Tracker: Ok</Panel>}
                {trackerState === 'disconnected' && <Panel variant="warning" className="px-1">Tracker: Disconnected</Panel>}
                {trackerState === 'error' && <Panel variant="danger" className="px-1">Tracker: Error</Panel>}

                {/* Data Channel State */}
                {dataChannelState === 'connecting' && <Panel variant="warning" className="px-1">Ship: Connecting...</Panel>}
                {dataChannelState === 'connected' && <Panel variant="dark" className="px-1">Ship: Ok ({timingStats?.pingDuration.toFixed(0) ?? '?'}ms)</Panel>}
                {dataChannelState === 'disconnected' && <Panel variant="danger" className="px-1">Ship: Disconnected</Panel>}
                {dataChannelState === 'error' && <Panel variant="danger" className="px-1">Ship: Error</Panel>}
            </small>
            <div className="flex-grow-1" />
            <Button variant='dark' onClick={returnToShipSelector}>Sign Off</Button>
        </Panel>
    )
}