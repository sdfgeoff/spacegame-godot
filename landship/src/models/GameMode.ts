import { ShipDataResponse } from "../network/TrackerMessages";

export type GameMode =
  | {
      mode: "play";
      shipData: ShipDataResponse;
    }
  | {
      mode: "home";
    };
