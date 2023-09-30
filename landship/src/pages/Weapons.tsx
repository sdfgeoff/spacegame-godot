import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FromRouterMessage } from '../models/Messages';
import TacticalDisplay, { DisplayItem } from '../components/tactical_display/TacticalDisplay';


interface SensedObject {
    designation: string,
    position: [number, number, number],
    time_last_seen: number,
}


const computeRange = (position: [number, number, number]) => {
    return Math.sqrt(position[0] * position[0] + position[1] * position[1] + position[2] * position[2])
}


export const Weapons: React.FC = () => {
    const {
        dataChannelConsole: {
            dataChannelConsole,
            subscribeTopic
        }
    } = useAppContext()

    const [availableWeapons, setAvailableWeapons] = React.useState<FromRouterMessage<"Weapons_LauncherState">[]>([])
    const [sensedObjects, setSensedObjects] = React.useState<FromRouterMessage<"Sensor_Objects"> | undefined>()

    const [selectedDesignation, setSelectedDesignation] = React.useState<string | undefined>()

    const selectedObject: SensedObject | undefined = React.useMemo(() => sensedObjects?.message.payload.objects.find((o: SensedObject) => o.designation === selectedDesignation), [sensedObjects, selectedDesignation])

    React.useEffect(() => {
        return subscribeTopic("Weapons_LauncherState", (message) => {
            const weaponId = message.address_from;
            setAvailableWeapons((existingWeapons) => {
                const existingWeapon = existingWeapons.find(w => w.address_from === weaponId);
                if (existingWeapon) {
                    return existingWeapons.map(w => w.address_from === weaponId ? message : w);
                } else {
                    return [...existingWeapons, message];
                }
            })

        })
    }, [subscribeTopic, setAvailableWeapons])


    React.useEffect(() => {
        return subscribeTopic("Sensor_Objects", (message) => {
            setSensedObjects(message)
        })
    }, [subscribeTopic, setSensedObjects])


    const setTarget = React.useCallback((weaponId: number, target: string) => {
        dataChannelConsole.send({
            message: {
                topic: "Weapons_LauncherTarget",
                payload: {
                    target_designation: target,
                }
            },
            address_to: weaponId,
        })
    }, [dataChannelConsole])

    return <div className="d-flex h-100">
        <div>
        Weapons:
        {availableWeapons.map((weapon) => (
            <div key={weapon.address_from} className="d-flex">
                ({weapon.address_from}) {weapon.message.payload.type}:{' '}
                {weapon.message.payload.active ? 'active' : 'inactive'}{' '}
                {weapon.message.payload.current_target === '' ? 'no target' : weapon.message.payload.current_target}{' '}
                {weapon.message.payload.ammo}

                {weapon.message.payload.current_target === '' ? <button onClick={
                    () => setTarget(weapon.address_from, selectedObject?.designation ?? '')
                }>
                    Set Target
                </button>
                    : (
                        <button onClick={
                            () => setTarget(weapon.address_from, '')
                        }>
                            Clear Target
                        </button>
                    )}
            </div>
        ))}

        {selectedObject && <><div>Selected: {selectedObject.designation}</div><div>Range: {Math.round(computeRange(selectedObject.position))}m</div></>}
        </div>
        <div style={{
            aspectRatio: '1/1',
        }}>
            <TacticalDisplay

                displayItems={sensedObjects?.message.payload.objects ?? []}
                setSelected={(item) => {
                    setSelectedDesignation(item.designation)
                }}
                selected={selectedObject}

            />
        </div>

    </div>
};

