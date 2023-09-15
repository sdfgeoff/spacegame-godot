import React, { useState } from 'react'
import { Tracker } from '../network/Tracker'
import { Game, GameState } from '../game/game'



export const Host: React.FC<{ tracker: Tracker }> = ({ tracker }) => {

    const [gameState, setGameState] = useState<GameState | undefined>(undefined)
    
    return (
        <div className="flex-grow-1 position-relative">
            {/* You are hosting a game */}

            <div className="position-absolute top-0 left-0 right-0 bottom-0">
                <Game tracker={tracker} setGameState={setGameState} />
            </div>
            <div className="position-absolute top-0 left-0 right-0 bottom-0">
                Connected Clients:
                {gameState?.clients.map((clientState) => (
                    <div key={clientState.client_id}>
                        Client ID: {clientState.client_id}
                        State: {clientState.state}
                    </div>
                ))}

            </div>
        </div>
    )
}

