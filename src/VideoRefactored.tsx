import React, { useEffect, useRef, useState } from "react";
import OT from "@opentok/client";

import { apiKey, token, sessionId } from "./opentok.config";

// Handling all of our errors here by alerting them
function handleError(error: any) {
  if (error) {
    alert(error.message);
  }
}

const Video: React.FC = () => {
  const subscriberRef = useRef<HTMLDivElement>(null);
  const publisherRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<OT.Session>();
  const [publisher, setPublisher] = useState<OT.Publisher>();

  useEffect(() => {
    const initialSession = OT.initSession(apiKey, sessionId);
    setSession(initialSession);

    const initialPublisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "100%",
        height: "90%",
      },
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
    // Subscribe to a newly created stream
    if (!session || !publisher) return;

    let subscriber: any;
    session.on("streamCreated", function (event) {
      subscriber = session.subscribe(
        event.stream,
        "subscriber",
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        handleError
      );
    });

    session.on("streamDestroyed", function (event) {
      console.log("Stream " + event.stream.name + " ended. " + event.reason);
    });

    session.connect(token, function (error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        session?.publish(publisher, handleError);
      }
    });

    () => {
      session.unsubscribe(subscriber);
      session.disconnect();
    };
  }, [session, publisher]);

  return (
    <div id={"videos"}>
      <div id={"subscriber"} ref={subscriberRef}></div>
      <div id={"publisher"} ref={publisherRef}></div>
    </div>
  );
};

export default Video;
