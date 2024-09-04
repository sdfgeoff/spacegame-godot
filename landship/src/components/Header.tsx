// A heading that displays some metadata...

import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { Panel } from "./Panel";
import Button from "./Button";
import { Screens, ScreenType } from "../Screens";

export const Header: React.FC<{
  returnToShipSelector: () => void;
  screen: ScreenType | undefined;
  setScreen: React.Dispatch<React.SetStateAction<ScreenType | undefined>>;
}> = ({ returnToShipSelector, screen, setScreen }) => {
  const {
    tracker: { trackerState },
    dataChannelConsole: { dataChannelState },
    timingStats,
    gameMode,
  } = useAppContext();

  return (
    <Panel variant="dark" className="d-flex align-items-stretch p-05">
      <Panel variant="dark" className="px-1">
        <h1>
          {gameMode.mode === "home" && "Ship Selector"}
          {gameMode.mode === "play" && gameMode.gameData.game.name}
        </h1>
      </Panel>

      <div className="d-flex">
          {Screens.map((s) => {
            return (
              <Button
                variant="secondary"
                key={s.name}
                className="p-1"
                onClick={() => {
                  if (screen === s) {
                    setScreen(undefined);
                  } else {
                    setScreen(s);
                  }
                }}
                active={screen === s}
              >
                <div className="flex-grow-1">{s.name}</div>
              </Button>
            );
          })}
        </div>

        <div className="flex-grow-1" />


      {/* Tracker State */}
      <small className="d-flex flex-column justify-content-stretch">
        {trackerState === "connecting" && (
          <Panel variant="info" className="px-1">
            Tracker: Connecting...
          </Panel>
        )}
        {trackerState === "connected" && (
          <Panel variant="dark" className="px-1">
            Tracker: Ok
          </Panel>
        )}
        {trackerState === "disconnected" && (
          <Panel variant="warning" className="px-1">
            Tracker: Disconnected
          </Panel>
        )}
        {trackerState === "error" && (
          <Panel variant="danger" className="px-1">
            Tracker: Error
          </Panel>
        )}

        {/* Data Channel State */}
        {dataChannelState === "connecting" && (
          <Panel variant="warning" className="px-1">
            Ship: Connecting...
          </Panel>
        )}
        {dataChannelState === "connected" && (
          <Panel variant="dark" className="px-1">
            Ship: Ok ({timingStats?.pingDuration.toFixed(0) ?? "?"}ms)
          </Panel>
        )}
        {dataChannelState === "disconnected" && (
          <Panel variant="danger" className="px-1">
            Ship: Disconnected
          </Panel>
        )}
        {dataChannelState === "error" && (
          <Panel variant="danger" className="px-1">
            Ship: Error
          </Panel>
        )}
      </small>
      {gameMode.mode === "play" && (
      <Button variant="dark" onClick={returnToShipSelector}>
        Sign Off
      </Button>
      )}
    </Panel>
  );
};
