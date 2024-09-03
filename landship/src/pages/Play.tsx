import React, { useState } from "react";
import { Tracker } from "../network/Tracker";
import { GameDataResponse } from "../network/TrackerMessages";
import Panel from "../components/Panel";
import PanelTitled from "../components/PanelTitled";
import Button from "../components/Button";
import { Piloting } from "./Piloting";
import { Weapons } from "./Weapons";
import { GlobalHotKeys } from "react-hotkeys";
import { keyMap } from "../hotkeys";

export interface JoinProps {
  tracker: Tracker;
  gameData: GameDataResponse;
}

export const Screens = [
  {
    name: "Piloting",
    component: <Piloting />,
  },
  {
    name: "Weapons",
    component: <Weapons />,
  },
];

type Screen = (typeof Screens)[number];

export const Play: React.FC<JoinProps> = () => {
  const [screen, setScreen] = useState<Screen | undefined>();

  const hotKeyHandlers = {
    CONSOLE_PILOTING: () => {
      setScreen(Screens[0]);
    },
    CONSOLE_WEAPONS: () => {
      setScreen(Screens[1]);
    },
  };

  return (
    <div className="d-flex flex-row p-1 gap-1 flex-grow-1">
      <GlobalHotKeys keyMap={keyMap} handlers={hotKeyHandlers} />
      <PanelTitled
        variant="dark"
        heading={<h2 className="p-1">Ship Systems</h2>}
      >
        <div className="d-flex flex-column">
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
      </PanelTitled>
      {screen && (
        <Panel variant="dark" className="flex-grow-1">
          {screen.component}
        </Panel>
      )}
    </div>
  );
};
