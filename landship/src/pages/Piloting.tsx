import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FromRouterMessage, ToRouterMessage } from '../models/Messages';
import JoyPad, { Position } from '../components/Joypad';

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
        linear_y: pos.y,
    })), [setTargets])

    const pad2 = React.useCallback((pos: Position) => setTargets((old) => ({
        ...old,
        angular_x: pos.x,
        angular_y: pos.y,
    })), [setTargets])


    return <div>
        X: {latestMessage?.message.payload.pos_x}
        <div style={{
            width: '10em',
            height: '10em',
        }}>
            <JoyPad onPositionChange={pad1} />
            <JoyPad onPositionChange={pad2} />
        </div>

    </div>
};

export default Piloting;
