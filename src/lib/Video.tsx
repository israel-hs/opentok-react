import React, { useEffect, useRef, useState } from "react";
import OT from "@opentok/client";

import { apiKey, token, sessionId } from "../opentok.config";

// Handling all of our errors here by alerting them
function handleError(error: any) {
  if (error) {
    alert(error.message);
  }
}

const videoProperties: any = {
  insertMode: "append",
  width: "100%",
  height: "100%",
};

type Status = string | undefined;

const Video: React.FC = () => {
  console.log("Video");
  const subscriberRef = useRef<HTMLDivElement>(null);
  const publisherRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<OT.Session>();
  const [publisher, setPublisher] = useState<OT.Publisher>();
  const [sessionStatus, setSessionStatus] = useState<Status>();
  const [connectionStatus, setConnectionStatus] = useState<Status>();

  useEffect(() => {
    const initialSession = OT.initSession(apiKey, sessionId);
    setSession(initialSession);

    const initialPublisher = OT.initPublisher(
      "publisher",
      videoProperties,
      handleError
    );
    setPublisher(initialPublisher);

    return () => {
      initialSession.disconnect();
      session?.disconnect();

      initialPublisher.destroy();
      publisher?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!session || !publisher) return;

    // Subscribe to a newly created stream
    let subscriber: any;
    session.on({
      streamCreated: (event: any) => {
        subscriber = session.subscribe(
          event.stream,
          "subscriber",
          videoProperties,
          handleError
        );

        subscriber.on({
          disconnected: (_event: any) =>
            setConnectionStatus(
              "Stream has been disconnected unexpectedly. Attempting to automatically reconnect..."
            ),
          connected: (_event: any) => setConnectionStatus(undefined),
        });
      },
    });
    // session.on("streamCreated", function (event) {
    //   subscriber = session.subscribe(
    //     event.stream,
    //     "subscriber",
    //     {
    //       insertMode: "append",
    //       width: "100%",
    //       height: "100%",
    //     },
    //     handleError
    //   );
    // });

    session.on("streamDestroyed", function (event) {
      console.log("Stream " + event.stream.name + " ended. " + event.reason);
    });

    session.connect(token, function (error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
        setSessionStatus("Error connecting to the session.");
      } else {
        session?.publish(publisher, handleError);
        setSessionStatus("Connected to the session.");
      }
    });

    () => {
      session.unsubscribe(subscriber);
      session.disconnect();
    };
  }, [session, publisher]);

  return (
    <>
      {!!sessionStatus && <h3>{sessionStatus}</h3>}
      <div id={"videos"}>
        <div id={"subscriber"} ref={subscriberRef}></div>
        <div id={"publisher"} ref={publisherRef}></div>
      </div>
      {!!connectionStatus && <div>{connectionStatus}</div>}
    </>
  );
};

export default Video;
