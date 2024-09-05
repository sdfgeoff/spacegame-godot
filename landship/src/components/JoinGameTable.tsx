import React from "react";
import { ShipDataResponse } from "../network/TrackerMessages";
import Button from "./Button";

export const JoinGameTable: React.FC<{
  shipList: ShipDataResponse[];
  joinShip: (game: ShipDataResponse) => void;
}> = ({ shipList, joinShip }) => {
  return (
    <div>
      {shipList.length === 0 && <div className="p-2">No Ships Found</div>}

      {shipList.map((ship) => (
        <Button
          variant="secondary"
          key={ship.id}
          className="gap-2 p-2 w-100 d-flex"
          onClick={() => {
            joinShip(ship);
          }}
        >
          <div className="flex-grow-1 d-flex flex-column"><div><h3>{ship.ship.name}</h3></div><div><small>{ship.ship.type}</small></div></div>
        </Button>
      ))}
    </div>
  );
};
