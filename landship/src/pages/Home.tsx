import React, { useEffect, useState } from 'react';
import { Tracker } from '../network/Tracker';
import { JoinGameTable } from '../components/JoinGameTable';
import { GameDataResponse, MessageFromServer } from '../network/TrackerMessages';
import PanelTitled from '../components/PanelTitled';



const Home: React.FC<{ tracker: Tracker, joinGame: (gameData: GameDataResponse) => void }> = ({ tracker, joinGame }) => {

    const [gameList, setGameList] = useState<GameDataResponse[]>([])

    // Schedule a request for the game list every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => tracker.send({ key: 'ListRequest' }), 5000)
        return () => clearInterval(interval)
    }, [tracker])

    // Handle incoming messages
    useEffect(() => {
        const handler = (data: MessageFromServer) => {
            if (data.key !== 'ListResponse') {
                return
            }
            setGameList(data.games)
        }
        return tracker.subscribe(handler)
    }, [tracker])

    return (
        <div className="d-flex justify-content-center align-content-center p-2">
            <PanelTitled variant="primary" extraBorder='corner' className="p-2" heading={
                <h1 className="p-1">Connect To Ship</h1>
            }>
                <button onClick={() => tracker.send({ key: 'ListRequest' })}>Refresh</button>
                <JoinGameTable gameList={gameList} joinGame={joinGame} />
            </PanelTitled>
        </div>
    )
}

export default Home;
