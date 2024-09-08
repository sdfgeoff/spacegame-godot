import React from "react";
import { Tracker } from "../network/Tracker";
import { ShipDataResponse } from "../network/TrackerMessages";
import { GlobalHotKeys } from "react-hotkeys";
import { keyMap } from "../hotkeys";
import { Screens, ScreenType } from "../Screens";
import PanelTitled from "../components/PanelTitled";

export interface JoinProps {
  tracker: Tracker;
  shipData: ShipDataResponse;
  screen: ScreenType | undefined;
  setScreen: React.Dispatch<React.SetStateAction<ScreenType | undefined>>;
}

export const Play: React.FC<JoinProps> = ({ screen, setScreen }) => {
  const hotKeyHandlers = {
    CONSOLE_PILOTING: () => {
      setScreen(Screens[0]);
    },
    CONSOLE_WEAPONS: () => {
      setScreen(Screens[1]);
    },
  };

  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={hotKeyHandlers} />
      {screen ? (
        <>{screen.component()}</>
      ) : (
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <PanelTitled
            heading={<h2 className="p-1">No Console Selected</h2>}
            variant="warning"
            extraBorder="corner"
          >
            <div className="p-1">Select a console at the top of the screen</div>
          </PanelTitled>
        </div>
      )}
    </>
  );
};
