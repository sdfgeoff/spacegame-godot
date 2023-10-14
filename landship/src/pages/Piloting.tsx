import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FromRouterMessage, ToRouterMessage } from '../models/Messages';
import JoyPad, { Position } from '../components/Joypad';
import TacticalDisplay from '../components/tactical_display/TacticalDisplay';
import { GlobalHotKeys } from 'react-hotkeys';
import { keyMap } from '../hotkeys';

export const Piloting: React.FC = () => {
    const {
        dataChannelConsole: {
            dataChannelConsole,
            subscribeTopic
        }
    } = useAppContext()

    const [latestMessage, setLatestMessage] = React.useState<FromRouterMessage<"GNC_State"> | undefined>()

    const [targets, setTargets] = React.useState({
        linear_x: 0,
        linear_y: 0,
        linear_z: 0,
        angular_x: 0,
        angular_y: 0,
        angular_z: 0,
    }
    )

    React.useEffect(() => {
        dataChannelConsole.send({
            message: {
                topic: "GNC_Targets",
                payload: targets
            }
        })
    }, [dataChannelConsole, targets])


    React.useEffect(() => {
        return subscribeTopic("GNC_State", (message) => {
            setLatestMessage(message)
        })
    }, [subscribeTopic])

    const pad1 = React.useCallback((pos: Position) => setTargets((old) => ({
        ...old,
        linear_x: pos.x,
        linear_y: -pos.y,
    })), [setTargets])

    const pad2 = React.useCallback((pos: Position) => setTargets((old) => ({
        ...old,
        angular_x: -pos.y,
        angular_y: -pos.x,
    })), [setTargets])


    const keyHandlers = React.useMemo(() => ({
        'RCS_FORWARD': () => setTargets((old) => ({
            ...old,
            linear_z: 1,
        })),
        'RCS_BACKWARD': () => setTargets((old) => ({
            ...old,
            linear_z: -1,
        })),
        'RCS_LEFT': () => setTargets((old) => ({
            ...old,
            linear_x: -1,
        })),
        'RCS_RIGHT': () => setTargets((old) => ({
            ...old,
            linear_x: 1,
        })),
        'RCS_UP': () => setTargets((old) => ({
            ...old,
            linear_y: 1,
        })),
        'RCS_DOWN': () => setTargets((old) => ({
            ...old,
            linear_y: -1,
        })),
        'RCS_ROLL_LEFT': () => setTargets((old) => ({
            ...old,
            angular_z: 1,
        })),
        'RCS_ROLL_RIGHT': () => setTargets((old) => ({
            ...old,
            angular_z: -1,
        })),
        'RCS_YAW_LEFT': () => setTargets((old) => ({
            ...old,
            angular_y: 1,
        })),
        'RCS_YAW_RIGHT': () => setTargets((old) => ({
            ...old,
            angular_y: -1,
        })),
        'RCS_PITCH_UP': () => setTargets((old) => ({
            ...old,
            angular_x: 1,
        })),
        'RCS_PITCH_DOWN': () => setTargets((old) => ({
            ...old,
            angular_x: -1,
        })),
    }), [setTargets])

    return <div className='d-flex'>
        <GlobalHotKeys
            keyMap={keyMap}
            handlers={keyHandlers}
        />
        <div style={{
            width: '10em',
            height: '10em',
        }}>
            <JoyPad onPositionChange={pad1} />
        </div>
        <div style={{
            width: '10em',
            height: '10em',
        }}>
            <JoyPad onPositionChange={pad2} />
        </div>
    </div>
};

export default Piloting;
