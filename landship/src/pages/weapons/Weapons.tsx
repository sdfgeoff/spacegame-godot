import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { FromRouterMessage, Topic } from "../../models/Messages";
import TacticalDisplay from "../../components/tactical_display/TacticalDisplay";
import Panel from "../../components/Panel";
import PanelTitled from "../../components/PanelTitled";
import Button from "../../components/Button";
import WeaponTile from "./WeaponTile";
import { updateOrInsert } from "../../util/array";

const matchAddressFrom = <T extends Topic>(
  message: FromRouterMessage<T>,
): number | undefined => {
  return message.address_from;
};

interface SensedObject {
  designation: string;
  position: [number, number, number];
  time_last_seen: number;
}

const computeRange = (
  here: [number, number, number],
  position: [number, number, number],
) => {
  const a = here[0] - position[0];
  const b = here[1] - position[1];
  const c = here[2] - position[2];

  return Math.sqrt(a * a + b * b + c * c);
};

export const Weapons: React.FC = () => {
  const {
    dataChannelConsole: { dataChannelConsole, subscribeTopic },
  } = useAppContext();

  const [availableWeaponState, setAvailableWeaponState] = React.useState<
    FromRouterMessage<"Weapons_LauncherState">[]
  >([]);
  const [availableWeaponInfo, setAvailableWeaponInfo] = React.useState<
    FromRouterMessage<"Weapons_LauncherInfo">[]
  >([]);
  const [sensedObjects, setSensedObjects] = React.useState<
    FromRouterMessage<"Sensor_Objects"> | undefined
  >();

  const [selectedWeaponAddresses, setSelectedWeaponAddresses] = React.useState<
    number[]
  >([]);

  const [selectedDesignation, setSelectedDesignation] = React.useState<
    string | undefined
  >();

  const selectedObject: SensedObject | undefined = React.useMemo(
    () =>
      sensedObjects?.message.payload.objects.find(
        (o: SensedObject) => o.designation === selectedDesignation,
      ),
    [sensedObjects, selectedDesignation],
  );

  const availableWeapons = React.useMemo(() => {
    return availableWeaponInfo.map((info) => {
      const state = availableWeaponState.find(
        (i) => i.address_from === info.address_from,
      );
      return {
        state,
        info,
      };
    });
  }, [availableWeaponState, availableWeaponInfo]);

  React.useEffect(() => {
    return subscribeTopic("Weapons_LauncherState", (message) => {
      setAvailableWeaponState((existingWeapons) =>
        updateOrInsert(existingWeapons, message, matchAddressFrom),
      );
    });
  }, [subscribeTopic, setAvailableWeaponState]);

  React.useEffect(() => {
    return subscribeTopic("Weapons_LauncherInfo", (message) => {
      setAvailableWeaponInfo((existingWeapons) =>
        updateOrInsert(existingWeapons, message, matchAddressFrom),
      );
    });
  }, [subscribeTopic, setAvailableWeaponInfo]);

  React.useEffect(() => {
    return subscribeTopic("Sensor_Objects", (message) => {
      setSensedObjects(message);
    });
  }, [subscribeTopic, setSensedObjects]);

  const setTarget = React.useCallback(
    (weaponId: number, target: string) => {
      dataChannelConsole.send({
        message: {
          topic: "Weapons_LauncherTarget",
          payload: {
            target_designation: target,
          },
        },
        address_to: weaponId,
      });
    },
    [dataChannelConsole],
  );

  const sensorPosition = React.useMemo(() => {
    return sensedObjects?.message.payload.sensor_position ?? [0, 0, 0];
  }, [sensedObjects]);

  return (
    <>
      <PanelTitled
        heading={<h2>Weapons</h2>}
        variant="dark"
        className="p-1 flex-grow-1"
        extraBorder="corner"
      >
        <div className="d-flex flex-wrap gap-1 py-1">
          {availableWeapons.map((weapon) => {
            const selected = selectedWeaponAddresses.includes(
              weapon.info.address_from,
            );
            const onClick = () => {
              setSelectedWeaponAddresses((existing) => {
                if (existing.includes(weapon.info.address_from)) {
                  return existing.filter((a) => a !== weapon.info.address_from);
                } else {
                  return [...existing, weapon.info.address_from];
                }
              });
            };

            return (
              <WeaponTile
                weapon={weapon}
                selected={selected}
                onClick={onClick}
              />
            );
          })}
        </div>
      </PanelTitled>
      <div className="d-flex flex-column gap-1">
        <Panel variant="dark" className="p-1" extraBorder="corner">
          <div
            style={{
              aspectRatio: "1/1",
            }}
          >
            <TacticalDisplay
              displayItems={sensedObjects?.message.payload.objects ?? []}
              setSelected={(item) => {
                setSelectedDesignation(item.designation);
              }}
              selected={selectedObject}
              sensorPosition={sensorPosition}
            />
          </div>
        </Panel>

        <PanelTitled
          variant="dark"
          heading={<h2 className="m-0">Selected</h2>}
          className="p-1"
        >
          <div className="py-1">
            <div>
              Selected: {selectedObject ? selectedObject.designation : "-"}
            </div>
            <div>
              Range:{" "}
              {selectedObject ? (
                <>
                  {Math.round(
                    computeRange(sensorPosition, selectedObject.position),
                  )}
                  m
                </>
              ) : (
                "-"
              )}
            </div>
            <Button
              variant="success"
              className="p-1 w-100"
              disabled={!selectedObject || selectedWeaponAddresses.length === 0}
              onClick={() => {
                selectedWeaponAddresses.forEach((address) => {
                  setTarget(
                    address,
                    selectedObject ? selectedObject.designation : "",
                  );
                });
              }}
            >
              Target with {selectedWeaponAddresses.length} weapon
              {selectedWeaponAddresses.length > 1 ? "s" : ""}
            </Button>
          </div>
        </PanelTitled>
        <PanelTitled
          variant="dark"
          heading={<h2 className="m-0">Systems</h2>}
          className="py-1"
        >
          <div className="p-1">
            <Button
              variant="warning"
              className="p-1 w-100"
              onClick={() => {
                availableWeaponState.forEach((weap) => {
                  setTarget(weap.address_from, "");
                });
              }}
            >
              Cease Fire
            </Button>
          </div>
        </PanelTitled>
      </div>
    </>
  );
};
