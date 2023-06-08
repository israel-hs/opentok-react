import OT from "@opentok/client";

import { addMember } from "../api/callApi";
import React, { useEffect, useState, useRef } from "react";
import { apiKey, token, sessionId } from "../opentok.config";
import { CallProps, SignalEvent, StreamCreatedEvent } from "./types";
import {
  createPublisherListernerMap,
  createSessionListenersMap,
  createSubscriberListenerMap,
  handleError,
} from "./utils";

import "@vonage/screen-share/screen-share.js";

const callProperties: OT.SubscriberProperties = {
  insertMode: "append",
  width: "100%",
  height: "100%",
};

const Call: React.FC<CallProps> = ({ userId, sendSignal }) => {
  const [value] = useState(0);
  const [signalText, setSignalText] = useState("");

  const screenshare = useRef<
    HTMLElement & { session: OT.Session; token: string }
  >(null);

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
      "signal:therapist": (event: SignalEvent) => {
        const sender = event.data;
        const text =
          event.from === session.connection
            ? "You have emitted a signal"
            : `You have received a signal ${sender ? `from ${sender}` : ""}`;

        setSignalText(text);
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
      <div style={{ marginTop: "10px" }}>{signalText}</div>
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
      {sendSignal && (
        <button
          onClick={() => {
            if (session) sendSignal(session);
          }}
        >
          Emit Signal
        </button>
      )}
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
