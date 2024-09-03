export interface GameData {
  name: string;
}

export interface ListRequest {
  key: "ListRequest";
}

export interface MessageRequest {
  key: "MessageRequest";
  addr_to: number;
  data: string;
}

export interface HostingUpdate {
  key: "HostingUpdate";
  game: GameData;
}

export interface GameDataResponse {
  id: number;
  game: GameData;
}

export interface ListResponse {
  key: "ListResponse";
  games: GameDataResponse[];
}

export interface MessageResponse {
  key: "MessageResponse";
  addr_from: number;
  data: string;
}

export interface ErrorResponse {
  key: "ErrorResponse";
  details: string;
}

export type MessageToServer = ListRequest | MessageRequest | HostingUpdate;

export type MessageFromServer = ListResponse | MessageResponse | ErrorResponse;

export const encodeMessageToServer = (message: MessageToServer): string => {
  return JSON.stringify(message);
};

export const decodeMessageFromServer = (message: string): MessageFromServer => {
  return JSON.parse(message);
};
