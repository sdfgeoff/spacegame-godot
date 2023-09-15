import React from 'react'
import { GameDataResponse } from '../network/TrackerMessages'



export const JoinGameTable: React.FC<{gameList: GameDataResponse[], joinGame: (game: GameDataResponse) => void}> = ({gameList, joinGame}) => {
    return (
    <div>
        <button disabled className="gap-2 p-2 w-100 d-flex">
            <div className="flex-grow-1">Name</div>
        </button>

        {gameList.map(game => (
            <button key={game.id} className="gap-2 p-2 w-100 d-flex" onClick={() => {joinGame(game)}}>
                <div className="flex-grow-1">{game.game.name}</div>
            </button>
        ))}
    </div>)
}