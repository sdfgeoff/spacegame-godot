import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { FromRouterMessage } from "../models/Messages";
import JoyPad, { Position } from "../components/Joypad";
import { useKeyMap } from "../hotkeys";
import Panel from "../components/Panel";

export const Piloting: React.FC = () => {
  const {
    dataChannelConsole: { dataChannelConsole, subscribeTopic },
  } = useAppContext();

  const [_latestMessage, setLatestMessage] = React.useState<
    FromRouterMessage<"GNC_State"> | undefined
  >();

  const [targets, setTargets] = React.useState({
    linear_x: 0,
    linear_y: 0,
    linear_z: 0,
    angular_x: 0,
    angular_y: 0,
    angular_z: 0,
  });

  React.useEffect(() => {
    dataChannelConsole.send({
      message: {
        topic: "GNC_Targets",
        payload: targets,
      },
    });
  }, [dataChannelConsole, targets]);

  React.useEffect(() => {
    return subscribeTopic("GNC_State", (message) => {
      setLatestMessage(message);
    });
  }, [subscribeTopic]);

  const pad1 = React.useCallback(
    (pos: Position) =>
      setTargets((old) => ({
        ...old,
        linear_x: pos.x,
        linear_y: -pos.y,
      })),
    [setTargets],
  );

  const pad2 = React.useCallback(
    (pos: Position) =>
      setTargets((old) => ({
        ...old,
        angular_x: -pos.y,
        angular_y: -pos.x,
      })),
    [setTargets],
  );

  const keys = useKeyMap();

  React.useEffect(
    () =>
      setTargets((old) => ({
        ...old,
        linear_x: keys.RCS_LEFT ? 1 : keys.RCS_RIGHT ? -1 : 0,
        linear_y: keys.RCS_UP ? 1 : keys.RCS_DOWN ? -1 : 0,
        linear_z: keys.RCS_FORWARD ? 1 : keys.RCS_BACKWARD ? -1 : 0,
        angular_x: keys.RCS_PITCH_DOWN ? 1 : keys.RCS_PITCH_UP ? -1 : 0,
        angular_y: keys.RCS_YAW_LEFT ? 1 : keys.RCS_YAW_RIGHT ? -1 : 0,
        angular_z: keys.RCS_ROLL_RIGHT ? 1 : keys.RCS_ROLL_LEFT ? -1 : 0,
      })),
    [keys, setTargets],
  );

  return (
    <Panel variant="dark" className="flex-grow-1">

    <div className="d-flex">
      <div
        style={{
          width: "10em",
          height: "10em",
        }}
      >
        <JoyPad onPositionChange={pad1} />
      </div>
      <div
        style={{
          width: "10em",
          height: "10em",
        }}
      >
        <JoyPad onPositionChange={pad2} />
      </div>
    </div>
    </Panel>
  );
};

export default Piloting;
