
import React from 'react';
import { Tracker } from '../src/network/Tracker';
import { DataChannelConsole } from '../src/network/DataChannelConsole';
import { AppContext } from '../src/contexts/AppContext';


export const AppContextDecorator = (Stor, { parameters: { authOptions }}) => {
    const tracker = React.useMemo(() => new Tracker('ws://localhost'), []);
    const console = React.useMemo(() => new DataChannelConsole(), []);
    return <AppContext.Provider value={{
      tracker: {
        tracker: tracker,
        trackerState: 'disconnected',
        },
        dataChannelConsole: {
          dataChannelConsole: console,
          dataChannelState: 'disconnected',
          topicSubscriptions: [],
          subscribeTopic: (t, h) => {return () => {}},
        },
        timingStats: {
            pingDuration: 23,
            clockOffset: 205
        },
        gameMode: {
          mode: 'home',
        },
      }
    }>
       <Stor />
    </AppContext.Provider>
  };