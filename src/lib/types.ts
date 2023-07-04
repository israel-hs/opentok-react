import OT from "@opentok/client";

export type Member = string;
export type Devices = MediaDeviceInfo[];

export type StreamCreatedEvent = OT.Event<"streamCreated", OT.Session> & {
  stream: OT.Stream;
};

export interface CallProps {
  userId: string;
  sendSignal?: (session: OT.Session) => void;
}

export interface Members {
  members: Member[];
}

export type SignalEvent = OT.Event<"signal", OT.Session> & {
  type?: string;
  data?: string;
  from: OT.Connection | null;
};

export type StreamDestroyedEvent = OT.Event<"streamDestroyed", OT.Publisher> & {
  stream: OT.Stream;
  reason: string;
};

export type RoomInfo = { openTokSessionId: string; openTokAccessToken: string };
