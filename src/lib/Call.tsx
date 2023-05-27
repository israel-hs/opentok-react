import OT from "@opentok/client";

import React, { useEffect, useState, useRef } from "react";
import { addMember } from "../api/callApi";
import { CallProps, StreamCreatedEvent } from "./types";
import { apiKey, token, sessionId } from "../opentok.config";
import {
  createPublisherListernerMap,
  createSessionListenersMap,
  createSubscriberListenerMap,
} from "./utils";

import "@vonage/screen-share/screen-share.js";

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
  const [value] = useState(0);
  const screenshare = useRef<HTMLElement & { session: any; token: any }>(null);

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

  // Create a publisher (video & audio feed), this will create a stream
  const createPublisher = () => {
    const publisher = OT.initPublisher(
      "publisher",
      callProperties,
      handleError
    );
    const publisherEvents = createPublisherListernerMap();
    publisher.on({ ...publisherEvents });
    return publisher;
  };

  // const tryPublishingAgain = () => {
  //   if (session) {
  //     console.log("session is not null");
  //     if (!publisher) {
  //       console.log("publisher is null");
  //       publisher = createPublisher();
  //     }
  //     session.publish(publisher, handleError);
  //   } else {
  //     console.log("session is null");
  //   }
  // };

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

    // Effectively connect to the session
    session.connect(token, (error) => {
      console.log("session connect");
      if (error) {
        handleError(error);
      }
    });

    const sessionEvents = createSessionListenersMap();

    session.on({
      ...sessionEvents,
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        publisher = createPublisher();
        session.publish(publisher, handleError);
      },
      streamCreated: (event: StreamCreatedEvent) => {
        // Subscribe to a newly created stream
        console.log("streamCreated", event);
        subscriber = subscribeToSession(event.stream);

        const subscriberEvents = createSubscriberListenerMap();
        subscriber.on({
          ...subscriberEvents,
        });
      },
    });

    if (screenshare.current) {
      screenshare.current.session = session;
      screenshare.current.token = token;
    }

    return () => {
      // clearInterval(interval);
      console.log("unmounting component");

      // this is not working: this cleanup function is invoked after unmount
      // therefore screenshare.current reference is already null:
      if (screenshare.current) {
        (screenshare.current as any).disconnectedCallback();
      }

      if (subscriber) {
        session.unsubscribe(subscriber);
        subscriber.off();
        console.log("subscriber unsubscribed from session");
      }

      if (publisher) {
        session.unpublish(publisher);
        publisher.off();
        publisher.destroy();
        console.log("session unpublished the publisher, publisher destroyed");
      }

      session.off(); // clean all session listeners
      session.disconnect();
      console.log("session disconnected");
    };
  }, [value]);

  return (
    <>
      <div id="videos" key={value}>
        <div id="subscriber" />
        <div id="publisher" />
      </div>
      {/* <button
        style={{ marginTop: "10px" }}
        onClick={() => setValue((previousValue) => previousValue + 1)}
      >
        Add Value manually
      </button> */}
      <screen-share
        start-text="start screen share"
        stop-text="stop screen share"
        width="300px"
        height="240px"
        ref={screenshare}
      ></screen-share>
      {/* <button onClick={tryPublishingAgain}>Manual Publish</button> */}
    </>
  );
};

export default Call;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "screen-share": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        width: string;
        height: string;
      };
    }
  }
}
