// The datachannel is the primary means with which a console communicates
// with the host. This file contains the code for the host side of the
// game: the host has to mantain a list of clients, regularly send messages to
// them etc.
import { Tracker } from './Tracker';
import { DATACHANNEL_CFG, DataChannelState, RTC_CFG } from './DataChannelShared';
import { MessageFromServer, MessageResponse } from './TrackerMessages';
import { FromRouterMessage, ToRouterMessage } from '../models/Messages';


type Client = {
    peerConnection: RTCPeerConnection
    sendDataChannel?: RTCDataChannel
    receiveDataChannel?: RTCDataChannel
    state: DataChannelState
}



export class DataChannelHost {
    tracker?: Tracker
    clients: { [id: number]: Client } = []

    onMessage: ((clientId: number, message: ToRouterMessage) => void)[] = []
    onClientStateChange: ((clientId: number, state: DataChannelState) => void)[] = []


    setTracker(tracker: Tracker) {
        this.tracker = tracker;
        const unsub = tracker.subscribe(this._handleMessageFromTracker);
        return () => {
            unsub();
            this.tracker = undefined;
        }
    }

    subscribeClientMessage = (cb: (clientId: number, message: ToRouterMessage) => void) => {
        this.onMessage.push(cb)
        return () => {
            this.onMessage = this.onMessage.filter((x) => x !== cb)
        }
    }


    subscribeStateChange(callback: (clientId: number, state: DataChannelState) => void): (() => void) {
        this.onClientStateChange.push(callback);
        return () => {
            this.onClientStateChange = this.onClientStateChange.filter((c) => c !== callback);
        }
    }

    sendMessageToClient = (clientId: number, message: FromRouterMessage) => {
        const outData = new TextEncoder().encode(JSON.stringify(message))
        console.log(outData)
        this.clients[clientId].sendDataChannel?.send(outData)
    }


    _handleMessgeFromClient(clientId: number, message: ToRouterMessage) {
        this.onMessage.forEach((cb) => cb(clientId, message))
    }

    _handleMessageFromTracker = async (message: MessageFromServer) => {
        if (message.key === 'MessageResponse') {
            // The server has passed us a message from another client
            const data = JSON.parse(message.data)
            if (data.type === 'offer') {
                await this._createClientFromOffer(message, data)
            } else if (data.type === 'ice') {
                this.clients[message.addr_from].peerConnection.addIceCandidate(data.candidate)
            } else {
                console.log('Received message from another client via tracker with unknown type', data)
            }
        }
    }

    _setClientState(clientId: number, state: DataChannelState) {
        this.clients[clientId].state = state;
        this.onClientStateChange.forEach((callback) => {
            callback(clientId, state);
        });
    }


    _createClientFromOffer = async (message: MessageResponse, data: any) => {
        console.log("Got offer from client", message.addr_from)
        const peerConnection = new RTCPeerConnection(RTC_CFG)
        this.clients[message.addr_from] = {
            peerConnection: peerConnection,
            state: 'connecting',
        }
        peerConnection.setRemoteDescription(data)

        const handleDataChannelMessage = (m: string) => {
            const data = JSON.parse(m)
            this._handleMessgeFromClient(message.addr_from, data)
        }

        peerConnection.ondatachannel = (e) => {
            console.log("Got data channel from client", message.addr_from)
            this.clients[message.addr_from].receiveDataChannel = e.channel
            e.channel.onmessage = function (e) {
                handleDataChannelMessage(e.data)
            }
        }

        const sendDataChannel = peerConnection.createDataChannel('unreliableSendChannel', DATACHANNEL_CFG);
        const setClientState = (state: DataChannelState) => {
            this._setClientState(message.addr_from, state)
        }
        sendDataChannel.onopen = function () {
            setClientState('connected')
        }
        sendDataChannel.onerror = function () {
            setClientState('error')
        }
        sendDataChannel.onclose = function () {
            setClientState('disconnected')
        };
        this.clients[message.addr_from].sendDataChannel = sendDataChannel;

        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        this.tracker?.send({
            addr_to: message.addr_from,
            key: 'MessageRequest',
            data: JSON.stringify(answer),
        })

        const sendCandidate = (e: RTCPeerConnectionIceEvent) => {
            console.log("Sending ICE Candidate")
            this.tracker?.send({
                addr_to: message.addr_from,
                key: 'MessageRequest',
                data: JSON.stringify({
                    'type': 'ice',
                    'candidate': e.candidate
                }),
            })
        }
        peerConnection.onicecandidate = sendCandidate
    }

}