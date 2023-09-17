import { useCallback, useEffect, useMemo, useState } from 'react';
import './theme/theme.css';
import Home from './pages/Home';
import { useTrackerInternal } from './hooks/useTracker';
import { useDataChannelConsoleInternal } from './hooks/useDataChannelConsole';
import { GameMode } from './models/GameMode';
import { Header } from './components/Header';
import { Join } from './pages/Join';
import { GameDataResponse } from './network/TrackerMessages';
import { AppContext } from './contexts/AppContext';
import { usePingShip, useTimingStatsInternal } from './hooks/useServerTime';

const TRACKER_URL = "ws://" + window.location.hostname + ":" + 42425;



function App() {

  const [mode, setMode] = useState<GameMode>({'mode': 'home'});

  const trackerData = useTrackerInternal(TRACKER_URL);
  const dataChannelData = useDataChannelConsoleInternal(trackerData.tracker, mode.mode==='play' ? mode.gameData.id : undefined);
  const timingStats = useTimingStatsInternal(dataChannelData);
  usePingShip(dataChannelData.dataChannelConsole)

  const joinGame = useCallback((gameData: GameDataResponse) => {
    setMode({
      mode: 'play',
      gameData: gameData
    })
  }, [setMode])


  return (<>
  <AppContext.Provider value={{tracker: trackerData, dataChannelConsole: dataChannelData, timingStats }}>
    <Header />
    {mode.mode === 'home' && <Home tracker={trackerData.tracker} joinGame={joinGame} />}
    {mode.mode === 'play' && <Join tracker={trackerData.tracker} gameData={mode.gameData} />}
    
  </AppContext.Provider>
  </>


  );
}

export default App;

