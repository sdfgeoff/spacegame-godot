// Utility Component that sends game information to the tracker regularly

import React, { useEffect } from "react";
import { Tracker } from "./Tracker";
import { GameData } from "./TrackerMessages";

export const HostTracker: React.FC<{
  tracker: Tracker;
  gameData: GameData;
}> = ({ tracker, gameData }) => {
  useEffect(() => {
    // Keep tracker up to date with gameData - send messages every
    // 10 seconds or when the gameData changes
    const sendUpdate = () => {
      tracker.send({ key: "HostingUpdate", game: gameData });
    };

    const interval = setInterval(sendUpdate, 10000);
    sendUpdate();
    return () => clearInterval(interval);
  }, [tracker, gameData]);

  return <></>;
};
