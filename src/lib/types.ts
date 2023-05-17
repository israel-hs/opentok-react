export type Member = string;

export type RoomType = "core" | "web";

export type StreamCreatedEvent = OT.Event<"streamCreated", OT.Session> & {
  stream: OT.Stream;
};

export interface CallProps {
  userId: string;
}

export interface Members {
  members: Member[];
}
