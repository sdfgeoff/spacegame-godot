import React from "react";
import PanelTitled from "../../components/PanelTitled";
import { FromRouterMessage } from "../../models/Messages";

interface WeaponInfoComplete {
  state: FromRouterMessage<"Weapons_LauncherState"> | undefined;
  info: FromRouterMessage<"Weapons_LauncherInfo">;
}

export interface WeaponTileProps {
  weapon: WeaponInfoComplete;
  selected: boolean;
  onClick: () => void;
}

const WeaponTile: React.FC<WeaponTileProps> = ({
  weapon,
  selected,
  onClick,
}) => {
  return (
    <button
      key={weapon.info.address_from}
      className="m-0 p-0"
      onClick={onClick}
    >
      <PanelTitled
        className="p-05"
        heading={
          <h3 className="m-0">
            ({weapon.info.address_from}) {weapon.info.message.payload.type}
          </h3>
        }
        variant={selected ? "primary" : "secondary"}
        extraBorder={selected ? "corner" : undefined}
      >
        <div
          className={
            weapon.state?.message.payload.state === "idle"
              ? "panel-success"
              : "panel-danger"
          }
        >
          State: {weapon.state?.message.payload.state}
        </div>
        <div>Ammo: {weapon.state?.message.payload.ammo}</div>
        <div>
          Target:{" "}
          {weapon.state?.message.payload.current_target === ""
            ? "No Target"
            : weapon.state?.message.payload.current_target}{" "}
        </div>
      </PanelTitled>
    </button>
  );
};

export default WeaponTile;
