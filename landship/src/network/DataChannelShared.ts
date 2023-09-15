
export const RTC_CFG: RTCConfiguration = {
    "iceServers": [
        { "urls": "stun:stun4.l.google.com:19302" },
        { "urls": "stun:stun.3cx.com" }
    ],
}

export const DATACHANNEL_CFG: RTCDataChannelInit = {
    ordered: true,
    maxRetransmits: 0,
}

export type DataChannelState = 'connecting' | 'connected' | 'disconnected' | 'error';
