import React from 'react'
import { GameDataResponse } from '../network/TrackerMessages'
import Button from './Button'



export const JoinGameTable: React.FC<{gameList: GameDataResponse[], joinGame: (game: GameDataResponse) => void}> = ({gameList, joinGame}) => {
    return (
    <div>
        {gameList.length === 0 && <div className="p-2">No Ships Found</div>}

        {gameList.map(game => (
            <Button variant='secondary' key={game.id} className="gap-2 p-2 w-100 d-flex" onClick={() => {joinGame(game)}}>
                <div className="flex-grow-1">{game.game.name}</div>
            </Button>
        ))}
    </div>)
}