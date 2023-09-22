import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FromRouterMessage } from '../models/Messages';

export const Weapons: React.FC = () => {
    const {
        dataChannelConsole: {
            dataChannelConsole,
            subscribeTopic
        }
    } = useAppContext()

    const [availableWeapons, setAvailableWeapons] = React.useState<FromRouterMessage<"Weapons_LauncherState">[]>([])
    const [sensedObjects, setSensedObjects] = React.useState<FromRouterMessage<"Sensor_Objects"> | undefined>()


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
    }, [subscribeTopic, setAvailableWeapons])


    const setTarget = React.useCallback((weaponId: number, target: string) => {
        dataChannelConsole.send({
            message: {
            topic: "Weapons_LauncherTarget",
            payload: {
                target_designation: target,
            }},
            address_to: weaponId,
        })
    }, [dataChannelConsole])


    return <div>
        Weapons:
        {availableWeapons.map((weapon) => (
            <div key={weapon.address_from} className="d-flex">
                ({weapon.address_from}) {weapon.message.payload.type}:{' '}
                {weapon.message.payload.active ? 'active' : 'inactive'}{' '}
                {weapon.message.payload.current_target === '' ? 'no target': weapon.message.payload.current_target}{' '}
                {weapon.message.payload.ammo}
                <button onClick={
                    () => setTarget(weapon.address_from, sensedObjects?.message.payload.objects[0].designation ?? '')
                }>
                    Set Target
                </button>
                <button onClick={
                    () => setTarget(weapon.address_from, '')
                }>
                    Clear Target
                </button>
            </div>
        ))}
        Targets:
        {sensedObjects?.message.payload.objects.map((object: {
            designation: string,
            position: [number, number, number],
            time_last_seen: number,
        }) => (
            <div key={object.designation}>
                {object.designation} [{object.position[0]}, {object.position[1]}, {object.position[2]}]
                </div>
        ))}

    </div>
};

