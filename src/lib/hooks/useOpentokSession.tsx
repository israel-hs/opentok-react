import OT from "@opentok/client";

import { SignalEvent } from "../types";
import { useEffect, useState } from "react";
import { apiKey } from "../../opentok.config";
import { getOpentokCredentials } from "../../api/callApi";
import { createSessionListenersMap, handleError } from "../utils";

const useOpentokSession = () => {
  const [opentokSession, setOpentokSession] = useState<OT.Session>();
  const [signalText, setSignalText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let session: OT.Session | undefined;

    const controller = new AbortController();
    const roomId = 1;

    getOpentokCredentials(roomId, controller.signal)
      .then((credentials) => {
        console.log({ credentials });
        const { openTokSessionId: sessionId, openTokAccessToken: token } =
          credentials;

        console.log("session component is mounted");
        session = OT.initSession(apiKey, sessionId);

        session.connect(token, handleError);

        const sessionEvents = createSessionListenersMap();

        session.on({
          ...sessionEvents,
          // maybe this signal event should be moved to the Call component
          "signal:therapist": (event: SignalEvent) => {
            if (!session) return;
            const sender = event.data;
            const text =
              event.from === session.connection
                ? "You have emitted a signal"
                : `You have received a signal ${
                    sender ? `from ${sender}` : ""
                  }`;

            setSignalText(text);
          },
        });

        setOpentokSession(session);
      })
      .catch(() => setError("Error getting opentok credentials"));

    return () => {
      controller.abort();
      session?.off(); // clean all session listeners
      session?.disconnect();
      console.log("session disconnected");
    };
  }, []);

  return { opentokSession, signalText, error };
};

export default useOpentokSession;
