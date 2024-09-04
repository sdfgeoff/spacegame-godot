import React, { useEffect, useState } from "react";
import { Tracker } from "../network/Tracker";
import { JoinGameTable } from "../components/JoinGameTable";
import {
  ShipDataResponse,
  MessageFromServer,
} from "../network/TrackerMessages";
import PanelTitled from "../components/PanelTitled";

const Home: React.FC<{
  tracker: Tracker;
  joinShip: (gameData: ShipDataResponse) => void;
}> = ({ tracker, joinShip }) => {
  const [shipList, setShipList] = useState<ShipDataResponse[]>([]);

  // Schedule a request for the game list every 5 seconds
  useEffect(() => {
    const interval = setInterval(
      () => tracker.send({ key: "ListRequest" }),
      1000,
    );
    return () => clearInterval(interval);
  }, [tracker]);

  // Handle incoming messages
  useEffect(() => {
    const handler = (data: MessageFromServer) => {
      if (data.key !== "ListResponse") {
        return;
      }
      // sort the list in at least some stable order
      setShipList(data.ships.sort((a, b) => a.id - b.id));
    };
    return tracker.subscribe(handler);
  }, [tracker]);

  return (
    <div className="d-flex justify-content-center align-content-center p-2 flex-grow-1">
      <PanelTitled
        variant="primary"
        extraBorder="corner"
        heading={<h1 className="p-1">Connect To Ship</h1>}
      >
        <div className="p-1">
          <JoinGameTable shipList={shipList} joinShip={joinShip} />
        </div>
      </PanelTitled>
    </div>
  );
};

export default Home;
