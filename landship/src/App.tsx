import { useCallback, useState } from "react";
import "./theme/theme.css";
import Home from "./pages/Home";

import { useTrackerInternal } from "./hooks/useTracker";
import { useDataChannelConsoleInternal } from "./hooks/useDataChannelConsole";
import { GameMode } from "./models/GameMode";
import { Header } from "./components/Header";
import { Play } from "./pages/Play";
import { GameDataResponse } from "./network/TrackerMessages";
import { AppContext } from "./contexts/AppContext";
import { usePingShip, useTimingStatsInternal } from "./hooks/useServerTime";

const TRACKER_URL = "ws://" + window.location.hostname + ":" + 42425;

function App() {
  const [mode, setMode] = useState<GameMode>({ mode: "home" });

  const trackerData = useTrackerInternal(TRACKER_URL);
  const dataChannelData = useDataChannelConsoleInternal(
    trackerData.tracker,
    mode.mode === "play" ? mode.gameData.id : undefined,
  );
  const timingStats = useTimingStatsInternal(dataChannelData);
  usePingShip(dataChannelData.dataChannelConsole);

  const joinGame = useCallback(
    (gameData: GameDataResponse) => {
      setMode({
        mode: "play",
        gameData: gameData,
      });
    },
    [setMode],
  );

  const leaveGame = useCallback(() => {
    setMode({
      mode: "home",
    });
  }, [setMode]);

  return (
    <>
      <AppContext.Provider
        value={{
          tracker: trackerData,
          dataChannelConsole: dataChannelData,
          timingStats,
          gameMode: mode,
        }}
      >
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            background: "var(--c_dark_darkest)",
          }}
        >
          <div
            className="fill"
            style={{
              backgroundImage:
                "radial-gradient(var(--c_primary_darkest) 1px, rgba(0,0,0,0) 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="fill"
            style={{
              backgroundImage:
                "radial-gradient(var(--c_primary_darkest) 1px, rgba(0,0,0,0) 0)",
              backgroundSize: "8px 8px",
              opacity: 0.5,
            }}
          />
          <div className="fill d-flex flex-column">
            <Header returnToShipSelector={leaveGame} />
            <div className="flex-grow-1 d-flex">
              {mode.mode === "home" && (
                <Home tracker={trackerData.tracker} joinGame={joinGame} />
              )}
              {mode.mode === "play" && (
                <Play tracker={trackerData.tracker} gameData={mode.gameData} />
              )}
            </div>
          </div>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;
