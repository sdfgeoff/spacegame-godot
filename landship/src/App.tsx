import { useCallback, useEffect, useMemo, useState } from 'react';
import './theme/theme.css';
import Home from './pages/Home';
import { Tracker } from './network/Tracker';
import { GameMode } from './models/GameMode';
import { Header } from './components/Header';
import { Join } from './pages/Join';
import { GameDataResponse } from './network/TrackerMessages';

const TRACKER_URL = "ws://" + window.location.hostname + ":" + 42425;



function App() {

  const [mode, setMode] = useState<GameMode>({'mode': 'home'});

  const tracker = useMemo(() => new Tracker(TRACKER_URL), [])
  const [trackerState, setTrackerState] = useState<Tracker['state']>('connecting')

  useEffect(() => {
    const handler = (state: Tracker['state']) => {
      setTrackerState(state)
    }
    return tracker.subscribeState(handler)
  }, [tracker])

  const joinGame = useCallback((gameData: GameDataResponse) => {
    setMode({
      mode: 'play',
      gameData: gameData
    })
  }, [setMode])

  return (<>
  <Header trackerState={trackerState} gameMode={mode} />
    {mode.mode === 'home' && <Home tracker={tracker} joinGame={joinGame} />}
    {mode.mode === 'play' && <Join tracker={tracker} gameData={mode.gameData} />}
  </>
  );
}

export default App;
