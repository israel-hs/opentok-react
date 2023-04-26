import React, { useEffect, useRef, useState } from "react";
import OT from "@opentok/client";

import { apiKey, token, sessionId } from "./opentok.config";

const Video: React.FC = () => {
  const subscriberRef = useRef<HTMLDivElement>(null);
  const publisherRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<OT.Session>();
  const [publisher, setPublisher] = useState<OT.Publisher>();
  const [status, setStatus] = useState<"connected" | "error" | "idle">("idle");

  function handleConnect(error?: OT.OTError) {
    console.log("handleConnect");
    if (error) {
      setStatus("error");
    } else {
      setStatus("connected");
    }
  }

  //   function handleStreamCreated(event: { stream: OT.Stream }) {
  //     console.log("handleStreamCreated");
  //     if (!subscriberRef.current) return;
  //     console.log("subscriber is in the DOM");

  //     session?.subscribe(
  //       event.stream,
  //       subscriberRef.current,
  //       {
  //         insertMode: "append",
  //         width: "100%",
  //         height: "100%",
  //       },
  //       handleError
  //     );
  //   }

  const handleError = (error?: OT.OTError) => {
    if (error) console.error(error);
  };

  useEffect(() => {
    const session = OT.initSession(apiKey, sessionId);

    // session.on("streamCreated", handleStreamCreated);
    let subscriber: OT.Subscriber;
    session.on("streamCreated", (event) => {
      console.log(
        "streamCreated",
        "subscriber element:",
        subscriberRef.current
      );
      if (!subscriberRef.current) return;
      console.log("subscriber is in the DOM");

      subscriber = session.subscribe(
        event.stream,
        subscriberRef.current,
        {
          insertMode: "append",
          width: "100%",
          height: "100%",
        },
        handleError
      );
    });

    if (!publisherRef.current) return;
    const publisher = OT.initPublisher(
      publisherRef.current,
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      handleError
    );

    session.connect(token, (error) => {
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
    // setSession(session);

    return () => {
      console.log("session disconnect");
      if (subscriber) {
        console.log("unsubscribe subscribersss ");
        session.unsubscribe(subscriber);
      }
      session.unpublish(publisher);
      session.disconnect();
      publisher.destroy();
    };
  }, []);

  //   useEffect(() => {
  //     console.log("status", status);
  //     if (status === "connected" && session) {
  //       console.log("session exists");
  //       if (publisherRef.current) {
  //         const publisher = OT.initPublisher(
  //           publisherRef.current,
  //           {
  //             insertMode: "append",
  //             width: "100%",
  //             height: "100%",
  //           },
  //           handleError
  //         );
  //         setPublisher(publisher);
  //         session.publish(publisher, handleError);
  //       }
  //     }
  //   }, [status]);

  //   if (status === "error") return <>Error occurred while connecting</>;
  //   if (status === "idle") return <>Connecting</>;

  return (
    <>
      <div ref={subscriberRef}>Subscriber Available</div>
      <div ref={publisherRef}>Publisher Available</div>
    </>
  );
};

export default Video;
