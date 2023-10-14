import React from "react";
import { useState } from "react";


export const keyMap = {
  RCS_FORWARD: ["w"],
  RCS_BACKWARD: ["s"],
  RCS_LEFT: ["a"],
  RCS_RIGHT: ["d"],
  RCS_UP: ["r"],
  RCS_DOWN: ["f"],

  RCS_PITCH_UP: ["ArrowUp"],
  RCS_PITCH_DOWN: ["ArrowDown"],
  RCS_YAW_LEFT: ["ArrowLeft"],
  RCS_YAW_RIGHT: ["ArrowRight"],
  RCS_ROLL_LEFT: ["q"],
  RCS_ROLL_RIGHT: ["e"],

  CONSOLE_PILOTING: ["1"],
  CONSOLE_WEAPONS: ["2"],
};

type KeyMapState = {[key in keyof typeof keyMap]: boolean}

const Actions: (keyof typeof keyMap)[] = [
  "RCS_FORWARD",
  "RCS_BACKWARD",
  "RCS_LEFT",
  "RCS_RIGHT",
  "RCS_UP",
  "RCS_DOWN",

  "RCS_PITCH_UP",
  "RCS_PITCH_DOWN",
  "RCS_YAW_LEFT",
  "RCS_YAW_RIGHT",
  "RCS_ROLL_LEFT",
  "RCS_ROLL_RIGHT",

  "CONSOLE_PILOTING",
  "CONSOLE_WEAPONS",
]

type KeyHandler = (state: number) => void
type AllHandlers = {[key in keyof typeof keyMap]: KeyHandler}

export const useKeyMap = (handlers: Partial<AllHandlers>) => {
  const [keyMapState, setKeyMapState] = useState<KeyMapState>({
    RCS_FORWARD: false,
    RCS_BACKWARD: false,
    RCS_LEFT: false,
    RCS_RIGHT: false,
    RCS_UP: false,
    RCS_DOWN: false,

    RCS_PITCH_UP: false,
    RCS_PITCH_DOWN: false,
    RCS_YAW_LEFT: false,
    RCS_YAW_RIGHT: false,
    RCS_ROLL_LEFT: false,
    RCS_ROLL_RIGHT: false,

    CONSOLE_PILOTING: false,
    CONSOLE_WEAPONS: false,
  });

  const keyDownHandler = React.useCallback((event: KeyboardEvent) => {
    Actions.forEach((action) => {
      if (keyMap[action].includes(event.key)) {
        setKeyMapState((old) => ({
          ...old,
          [action]: true,
        }));
      }
    });
  }, [])

  const keyUpHandler = React.useCallback((event: KeyboardEvent) => {
    Actions.forEach((action) => {
      if (keyMap[action].includes(event.key)) {
        setKeyMapState((old) => ({
          ...old,
          [action]: false,
        }));
      }
    });
  }, [])

  React.useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [keyDownHandler, keyUpHandler]);

  React.useEffect(() => {
    Actions.forEach((action) => {
      const handler = handlers[action]
      if (!handler) {
        return
      }
      handler(keyMapState[action] ? 1 : 0)
    })
  }, [keyMapState, handlers])

  console.log(keyMapState)
}



