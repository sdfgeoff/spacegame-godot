import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FromRouterMessage } from '../models/Messages';
import JoyPad, { Position } from '../components/Joypad';

export const Piloting: React.FC = () => {
    const {
        dataChannelConsole: {
            dataChannelConsole,
            subscribeTopic
        }
    } = useAppContext()

    const [latestMessage, setLatestMessage] = React.useState<FromRouterMessage<"GNC_State"> | undefined>()



    const onPositionChange = React.useCallback((position: Position) => {
        dataChannelConsole.send({
            message: {
            topic: "GNC_Targets",
            payload: {
                linear_x: position.x,
                linear_y: position.y,
                linear_z: 0,
                angular_x: 0,
                angular_y: 0,
                angular_z: 0,
            }}

        })
    }, [dataChannelConsole])



    React.useEffect(() => {
        return subscribeTopic("GNC_State", (message) => {
            setLatestMessage(message)
        })
    }, [subscribeTopic])

        return <div>
            X: {latestMessage?.message.payload.pos_x}
            <div style={{
                width: '10em',
                height: '10em',
            }}>
                        <JoyPad onPositionChange={onPositionChange}/>
                        </div>

        </div>
    };

    export default Piloting;
