import OT from "@opentok/client";

import React, { useEffect } from "react";
import { addMember } from "../api/callApi";
import { CallProps, StreamCreatedEvent } from "./types";
import { apiKey, token, sessionId } from "../opentok.config";

function handleError(error?: OT.OTError) {
  if (error) {
    alert(error.message);
  }
}

const callProperties: OT.SubscriberProperties = {
  insertMode: "append",
  width: "100%",
  height: "100%",
};

const Call: React.FC<CallProps> = ({ userId }) => {
  // let stream: OT.Stream | null;
  let session: OT.Session;
  let subscriber: OT.Subscriber;
  let publisher: OT.Publisher;

  const subscribeToSession = (streamToUse: OT.Stream) => {
    return session.subscribe(
      streamToUse,
      "subscriber",
      callProperties,
      handleError
    );
  };

  useEffect(() => {
    const addMemberToCall = async () => {
      try {
        await addMember(userId);
      } catch (error) {
        console.error(error);
      }
    };
    addMemberToCall();

    // we might need poll data from the server every N secs
    // to check for members connecting and desconnecting for example

    // const interval = setInterval(async () => {
    //   try {
    //     const { members: fetchedMembers }: Members = await getMembers();
    //     // we can get connected subscribers any given time, given the stream like this:
    //     const subscribers = session.getSubscribersForStream(stream);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }, 2000);

    session = OT.initSession(apiKey, sessionId);

    session.on("streamCreated", (event: StreamCreatedEvent) => {
      console.log("streamCreated", event);
      subscriber = subscribeToSession(event.stream);
    });

    // Subscribe to a newly created stream

    // Effectively connect to the session
    session.connect(token, (error) => {
      console.log("session connect");
      if (error) {
        handleError(error);
      }
    });

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        // Create a publisher (video & audio feed), this will create a stream
        publisher = OT.initPublisher("publisher", callProperties, handleError);
        session.publish(publisher, handleError);
      },

      // connectionCreated: function (event: any) {
      //   console.log("connectionCreated");
      // },
      // connectionDestroyed: function (event: any) {
      //   console.log("connectionDestroyed");
      // },
      // sessionDisconnected: function sessionDisconnectHandler(event: any) {
      //   // The event is defined by the SessionDisconnectEvent class
      //   console.log("Disconnected from the session.");
      // },
    });

    return () => {
      // clearInterval(interval);

      session.off(); // clean all session listeners

      if (subscriber) {
        session.unsubscribe(subscriber);
        console.log("session unsubscribed");
      }

      if (publisher) {
        session.unpublish(publisher);
        publisher.destroy();
        console.log("publisher destroyed");
      }

      session.disconnect();
      console.log("session disconnected");
    };
  }, []);

  return (
    <div id="videos">
      <div id="subscriber" />
      <div id="publisher" />
    </div>
  );
};

export default Call;
