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

    console.log(availableWeapons)



    return <div>
        Weapons:
        {availableWeapons.map((weapon) => (
            <div key={weapon.address_from}>
                ({weapon.address_from}) {weapon.message.payload.type}:{' '}
                {weapon.message.payload.active ? 'active' : 'inactive'}{' '}
                {weapon.message.payload.current_target === '' ? 'no target': weapon.message.payload.current_target}{' '}
                {weapon.message.payload.ammo}
            </div>
        ))}

    </div>
};

