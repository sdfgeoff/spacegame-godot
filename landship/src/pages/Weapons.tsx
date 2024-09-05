import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { FromRouterMessage } from "../models/Messages";
import TacticalDisplay from "../components/tactical_display/TacticalDisplay";
import Panel from "../components/Panel";
import PanelTitled from "../components/PanelTitled";
import Button from "../components/Button";


interface SensedObject {
  designation: string;
  position: [number, number, number];
  time_last_seen: number;
}

const computeRange = (here: [number, number, number], position: [number, number, number]) => {
  const a = here[0] - position[0];
  const b = here[1] - position[1];
  const c = here[2] - position[2];

  return Math.sqrt(
    a * a + b * b + c * c
  );
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

  const [selectedWeaponAddresses, setSelectedWeaponAddresses] = React.useState<number[]>([]);

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
      const weaponId = message.address_from;
      setAvailableWeaponState((existingWeapons) => {
        const existingWeapon = existingWeapons.find(
          (w) => w.address_from === weaponId,
        );
        if (existingWeapon) {
          return existingWeapons.map((w) =>
            w.address_from === weaponId ? message : w,
          );
        } else {
          return [...existingWeapons, message];
        }
      });
    });
  }, [subscribeTopic, setAvailableWeaponState]);

  React.useEffect(() => {
    return subscribeTopic("Weapons_LauncherInfo", (message) => {
      const weaponId = message.address_from;
      setAvailableWeaponInfo((existingWeapons) => {
        const existingWeapon = existingWeapons.find(
          (w) => w.address_from === weaponId,
        );
        if (existingWeapon) {
          return existingWeapons.map((w) =>
            w.address_from === weaponId ? message : w,
          );
        } else {
          return [...existingWeapons, message];
        }
      });
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
    return sensedObjects?.message.payload.sensor_position ?? [0, 0, 0]
  }, [sensedObjects]);

  return (
    <div className="d-flex h-100 gap-1">
      <PanelTitled heading={<h2>Weapons</h2>} variant="dark" className="flex-grow-1 p-1" extraBorder="corner">
        <div className="d-flex flex-wrap gap-1 p-1">
          {availableWeapons.map((weapon) => {

            const selected = selectedWeaponAddresses.includes(weapon.info.address_from);
            
            return <button key={weapon.info.address_from} className="m-0 p-0" onClick={() => {
              setSelectedWeaponAddresses((existing) => {
                if (existing.includes(weapon.info.address_from)) {
                  return existing.filter((a) => a !== weapon.info.address_from);
                } else {
                  return [...existing, weapon.info.address_from];
                }
              });
            }}>
              <PanelTitled
                className="p-05"
                heading={<h3 className="m-0">({weapon.info.address_from}) {weapon.info.message.payload.type}</h3>}
                variant={selected ? "primary" : "secondary"}
                extraBorder={selected ? "corner" : undefined}
              >

                <div className={
                  weapon.state?.message.payload.state === "idle" ? "panel-success" : "panel-danger"
                }>State: {weapon.state?.message.payload.state}</div>
                <div>Ammo: {weapon.state?.message.payload.ammo}</div>
                <div>
                  Target:{" "}
                  {weapon.state?.message.payload.current_target === ""
                    ? "No Target"
                    : weapon.state?.message.payload.current_target}{" "}
                </div>
              </PanelTitled>
              </button>

          })}

            

              {/* {weapon.message.payload.current_target === "" ? (
              <button
                onClick={() =>
                  setTarget(
                    weapon.address_from,
                    selectedObject?.designation ?? "",
                  )
                }
              >
                Set Target
              </button>
            ) : (
              <button onClick={() => setTarget(weapon.address_from, "")}>
                Clear Target
              </button>
            )} */}
            
        </div>


      </PanelTitled>
      <div className="d-flex flex-column h-100 gap-1 flex-grow-1">
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
        {selectedObject && (
          <PanelTitled variant="dark" heading={<h2 className="m-0">Selected</h2>} className="p-1">
            <div className="p-1">
            <div>Selected: {selectedObject.designation}</div>
            <div>
              Range: {Math.round(computeRange(sensorPosition, selectedObject.position))}m
            </div>
            <Button variant="primary" className="p-1" onClick={
              () => {
                selectedWeaponAddresses.forEach((address) => {
                  setTarget(address, selectedObject.designation);
                });
              }
            }>
              Target with {selectedWeaponAddresses.length} weapon{selectedWeaponAddresses.length > 1 ? "s" : ""}
            </Button>
            </div>
          </PanelTitled>
        )}
        <PanelTitled variant="dark" heading={<h2 className="m-0">Systems</h2>} className="p-1">
          <div className="p-1">
            <Button variant="warning" className="p-1" onClick={
              () => {
                availableWeaponState.forEach((weap) => {
                  setTarget(weap.address_from, "");
                });
              }
            }>
              Cease Fire
            </Button>
            </div>
        </PanelTitled>
      
      </div>
    </div>
  );
};
