import OT from "@opentok/client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { SignalEvent } from "../types";
import { apiKey } from "../../opentok.config";
import { getOpentokCredentials } from "../../api/callApi";
import { createSessionListenersMap, handleError } from "../utils";
import { AppDispatch, RootState } from "../../redux/store";
import { setCredentials } from "../../redux/opentokCredentialsSlice";

const useOpentokSession = () => {
  const [opentokSession, setOpentokSession] = useState<OT.Session>();
  const [signalText, setSignalText] = useState("");
  const [error, setError] = useState("");

  const dispatch: AppDispatch = useDispatch();
  const { sessionId, token } = useSelector(
    (state: RootState) => state.opentokCredentials
  );

  console.log({ sessionId, token });

  useEffect(() => {
    const controller = new AbortController();
    const roomId = 1;

    getOpentokCredentials(roomId, controller.signal)
      .then((credentials) => {
        console.log({ credentials });
        const { openTokSessionId: sessionId, openTokAccessToken: token } =
          credentials;
        dispatch(setCredentials({ sessionId, token }));
      })
      .catch(() => setError("Error getting opentok credentials"));

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (!sessionId || !token) return;

    console.log("session component is mounted");
    const session = OT.initSession(apiKey, sessionId);

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
            : `You have received a signal ${sender ? `from ${sender}` : ""}`;

        setSignalText(text);
      },
    });

    setOpentokSession(session);

    return () => {
      session?.off();
      session?.disconnect();
      console.log("session disconnected");
    };
  }, [sessionId, token]);

  return { opentokSession, signalText, error };
};

export default useOpentokSession;
