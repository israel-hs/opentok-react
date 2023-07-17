import OT from "@opentok/client";
import { useEffect, useState } from "react";

import { apiKey } from "../../opentok.config";
import { getOpentokCredentials } from "../../api/callApi";
import { createSessionListenersMap, handleError } from "../utils";
import type {
  OpentokSession,
  RoomInfo,
  SignalEvent,
  StreamDestroyedEvent,
} from "../types";

function pollFunction(functionToPoll: () => void, interval: number) {
  return setInterval(functionToPoll, interval);
}

const pollEveryWhenConnected = 5000;
const pollEveryWhenDisconnected = 1500;

const useOpentokSession = (shouldPoll?: boolean) => {
  const [error, setError] = useState("");
  const [signalText, setSignalText] = useState("");
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();
  const [opentokSession, setOpentokSession] = useState<OpentokSession>();
  const [pollFrequency, setPollFrequency] = useState(pollEveryWhenConnected);

  let session: OpentokSession | undefined;

  function connectToSession() {
    const { openTokAccessToken } = roomInfo || {};
    session?.connect(openTokAccessToken ?? "", handleError);
  }

  // setting roomInfo state to undefined causes the session to be disconnected,
  // but if polling, the second there's roomInfo, the session will be recreated
  // effectivly resetting it
  // const resetSession = useCallback(() => {
  //   setRoomInfo(undefined);
  //   setOpentokSession(undefined);
  // }, []);

  useEffect(() => {
    const roomId = 1;
    let pollInterval: number | undefined;

    const fetchRoomStatus = async () => {
      try {
        const roomInfo = await getOpentokCredentials(roomId);
        setRoomInfo((current) =>
          current?.openTokAccessToken !== roomInfo.openTokAccessToken ||
          current?.openTokSessionId !== roomInfo.openTokSessionId
            ? roomInfo
            : current
        );
        setPollFrequency(pollEveryWhenConnected);
      } catch {
        setError("Error getting room info"); // probably we should not set a different kind of error here
        setPollFrequency(pollEveryWhenDisconnected);
        // setRoomInfo(undefined);
        // setOpentokSession(undefined);
      }
    };

    // fetch room status straight away for better UI experience
    fetchRoomStatus();

    if (shouldPoll) {
      pollInterval = pollFunction(fetchRoomStatus, pollFrequency);
    }

    return () => {
      pollInterval && clearInterval(pollInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollFrequency]);

  useEffect(() => {
    if (!roomInfo) return;

    const { openTokSessionId /*, openTokAccessToken*/ } = roomInfo;
    session = OT.initSession(apiKey, openTokSessionId) as OpentokSession;
    console.log("session is initialized");
    // session.connect(openTokAccessToken, handleError);
    connectToSession();

    const sessionEvents = createSessionListenersMap();

    session.on({
      ...sessionEvents,
      streamDestroyed: (event: StreamDestroyedEvent) => {
        console.log(
          "Session listened for a streamDestroyed event, reason:",
          event.reason
        );
        if (event.reason === "networkDisconnected") {
          event.preventDefault();
          const subscriberCount = session?.getSubscribersForStream(
            event.stream
          ).length;
          console.log(
            "network disconnected, # of subscribers for the stream",
            subscriberCount
          );
        }
      },
      // maybe this signal event should be moved to the Call component
      "signal:therapist": (event: SignalEvent) => {
        if (!session) return;
        const sender = event.data;
        const text =
          event.from === session.connection
            ? "You have emitted a signal"
            : `You have received a signal ${sender ? `from ${sender}` : ""}`;

        setSignalText(text);
      },
    });

    setOpentokSession(session);

    return () => {
      session?.off();
      session?.disconnect();
      console.log("Session disconnected");
    };
  }, [roomInfo]);

  return { opentokSession, signalText, error, connectToSession };
};

export default useOpentokSession;
