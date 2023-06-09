import OT from "@opentok/client";

import { useEffect, useState } from "react";
import { apiKey, token, sessionId } from "../../opentok.config";
import { createSessionListenersMap, handleError } from "../utils";
import { SignalEvent } from "../types";

const useOpentokSession = () => {
  const [opentokSession, setOpentokSession] = useState<OT.Session>();
  const [signalText, setSignalText] = useState("");

  useEffect(() => {
    console.log("session component is mounted");
    const session = OT.initSession(apiKey, sessionId);

    // Effectively connect to the session
    session.connect(token, handleError);

    const sessionEvents = createSessionListenersMap();

    session.on({
      ...sessionEvents,
      "signal:therapist": (event: SignalEvent) => {
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
      session.off(); // clean all session listeners
      session.disconnect();
      console.log("session disconnected");
    };
  }, []);

  return { opentokSession, signalText };
};

export default useOpentokSession;
