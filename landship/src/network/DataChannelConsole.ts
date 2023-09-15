// The datachannel is the primary means with which a console communicates
// with the host. This file contains the code for the console side of the
// game: the console has to establish a connection with the host
import { FromRouterMessage, ToRouterMessage } from '../models/Messages';
import { DATACHANNEL_CFG, DataChannelState, RTC_CFG } from './DataChannelShared';
import { Tracker } from './Tracker';
import { MessageFromServer } from './TrackerMessages';


export class DataChannelConsole {
    tracker?: Tracker
    host?: RTCPeerConnection
    sendDataChannel?: RTCDataChannel
    receiveDataChannel?: RTCDataChannel

    state: DataChannelState = 'disconnected'

    onMessage: ((message: any) => void)[] = []
    onStateChange: ((state: DataChannelState) => void)[] = []

    /**
     * Subscribe to receive messages sent to the console from the host
     * 
     * @param cb - The callback function to handle the received message.
     * @returns A function to unsubscribe from receiving messages.
     */
    subscribeMessage = (cb: (message: FromRouterMessage) => void): (() => void) => {
        this.onMessage.push(cb);
        return () => {
            this.onMessage = this.onMessage.filter((c) => c !== cb);
        }
    }

    /**
     * Subscribe to receive state change events of the data channel, such as 
     * when the connection is established or lost.
     * 
     * @param cb - The callback function to handle the state change event.
     * @returns A function to unsubscribe from receiving state change events.
     */
    subscribeStateChange = (cb: (state: DataChannelState) => void): (() => void) => {
        this.onStateChange.push(cb);
        return () => {
            this.onStateChange = this.onStateChange.filter((c) => c !== cb);
        }
    }


    /**
     * Send a message to the host from thos console
     * @param message - The message to be sent.
     */
    send = (message: ToRouterMessage) => {
        if (this.state !== 'connected') {
            console.error('Attempting to send message while disconnected')
            return
        }
        this.sendDataChannel?.send(JSON.stringify(message))
    }

    /**
     * Set the tracker for the data channel console.
     * This does not force the console to connect to the host, and merely changes
     * how they will signal each other if the datachannel needs to be reestablished.
     * 
     * @param tracker - The tracker instance.
     * @returns A function to unset the tracker.
     */
    setTracker(tracker: Tracker) {
        this.tracker = tracker;
        const unsub = this.tracker.subscribe(this._handleMessageFromTracker);
        return () => {
            unsub();
            this.tracker = undefined;
        }
    }

    /**
     * Connect to the game host.
     * @param gameHostId - The ID of the game host.
     */
    connect = async (gameHostId: number) => {
        if (this.host) {
            console.error('Attempting to create a second host')
            return
        }
        const host = new RTCPeerConnection(RTC_CFG);
        this.host = host;

        this._createSendDataChannel()

        const offer = await host.createOffer()
        host.setLocalDescription(offer);
        this.tracker?.send({
            addr_to: gameHostId,
            key: 'MessageRequest',
            data: JSON.stringify(offer),
        })

        const sendCandidate = (e: RTCPeerConnectionIceEvent) => {
            this.tracker?.send({
                addr_to: gameHostId,
                key: 'MessageRequest',
                data: JSON.stringify({
                    'type': 'ice',
                    'candidate': e.candidate
                }),
            })
        }
        host.onicecandidate = sendCandidate

        host.ondatachannel = this._handleDataChannelFromHost
    }

    /**
     * Handle the message received from the tracker.
     * @param message - The message received from the tracker.
     */
    _handleMessageFromTracker = (message: MessageFromServer) => {
        if (message.key === 'MessageResponse') {
            // The server has passed us a message from another client
            const data = JSON.parse(message.data)
            if (data.type === 'answer') {
                this.host?.setRemoteDescription(data)
            } else if (data.type === 'ice') {
                this.host?.addIceCandidate(data.candidate)
            } else {
                console.log('Received tracker message with unknown type', data)
            }
        }
    }


    _handleMessage = (message: MessageEvent) => {
        const as_text = new TextDecoder().decode(message.data);
        const data = JSON.parse(as_text)

        this.onMessage.forEach((cb) => cb(data));
    }

    /**
     * Handle the data channel received from the host.
     * @param e - The RTCDataChannelEvent containing the data channel.
     */
    _handleDataChannelFromHost = (e: RTCDataChannelEvent) => {
        this.receiveDataChannel = e.channel
        this.receiveDataChannel.onmessage = this._handleMessage
    }

    _setState = (state: DataChannelState) => {
        this.state = state;
        this.onStateChange.forEach((cb) => cb(state));
    }

    _createSendDataChannel = () => {
        if (!this.host) {
            throw new Error('Cannot create data channel before host is set')
        }
        const sendDataChannel = this.host.createDataChannel('unreliableSendChannel', DATACHANNEL_CFG);
        
        const setStateLocal = (state: DataChannelState) => {
            this._setState(state);
        }
        
        sendDataChannel.onopen = function () {
            setStateLocal('connected')
        }
        sendDataChannel.onerror = function () {
            setStateLocal('error')
        }
        sendDataChannel.onclose = function () {
            setStateLocal('disconnected')
        };

        this.sendDataChannel = sendDataChannel;
    }
}
