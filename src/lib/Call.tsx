import OT from "@opentok/client";
import { addMember } from "../api/callApi";
import React, { useEffect, useState, useRef } from "react";
import { CallProps, StreamCreatedEvent, StreamDestroyedEvent } from "./types";
import {
  createPublisherListernerMap,
  createSubscriberListenerMap,
  handleError,
} from "./utils";

import "@vonage/screen-share/screen-share.js";
import useOpentokSession from "./hooks/useOpentokSession";

const callProperties: OT.SubscriberProperties = {
  insertMode: "append",
  width: "100%",
  height: "100%",
};

const Call: React.FC<CallProps> = ({ userId, sendSignal }) => {
  const [value] = useState(0);
  const { opentokSession: session, signalText, error } = useOpentokSession();

  const screenshare = useRef<
    HTMLElement & { session: OT.Session; token: string }
  >(null);

  // let stream: OT.Stream | null;
  let subscriber: OT.Subscriber | undefined;
  let publisher: OT.Publisher;

  const subscribeToSession = (session: OT.Session, streamToUse: OT.Stream) => {
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
      (error) => {
        if (error) {
          alert("error while initializing the publisher " + error?.message);
        }
      }
      // handleError
    );
    const publisherEvents = createPublisherListernerMap();
    publisher.on({
      ...publisherEvents,
      streamDestroyed: (_event: StreamDestroyedEvent) => {
        console.log("streamDestroyed @ Publisher" /*, event*/);
        // following the docs, this should prevent the publisher from being removed from the DOM
        // https://tokbox.com/developer/sdks/js/reference/Session.html#unpublish
        // (not sure if this goes for the listener at the session)
        // event.preventDefault();
        // if (event.reason === "mediaStopped") {
        //   // this is a screenshare stream
        //   // remove the screenshare element
        //   screenshare.current?.remove();
        // }
      },
    });
    return publisher;
  };

  console.log("session", session);

  useEffect(() => {
    if (!session) return;

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

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        publisher = createPublisher();
        session.publish(publisher, handleError);
      },
      streamCreated: (event: StreamCreatedEvent) => {
        // Subscribe to a newly created stream
        console.log("streamCreated", event);
        subscriber = subscribeToSession(session, event.stream);

        if (!subscriber) return;
        const subscriberEvents = createSubscriberListenerMap();
        subscriber.on({
          ...subscriberEvents,
        });
      },

      // add signal event listener here
      // "signal:therapist": (event: OT.Session) => {
      //   console.log("signal:therapist", event);
      // },
    });

    // if (screenshare.current) {
    //   screenshare.current.session = session;
    //   screenshare.current.token = token;
    // }

    return () => {
      // clearInterval(interval);
      console.log("unmounting component");

      // this is not working: this cleanup function is invoked after unmount
      // therefore screenshare.current reference is already null:
      if (screenshare.current) {
        screenshare.current?.remove();
        // (screenshare.current as any).disconnectedCallback();
      }

      if (subscriber) {
        session.unsubscribe(subscriber);
        subscriber.off();
        console.log("subscriber unsubscribed from session");
      }

      if (publisher) {
        // console.log("session connection", session.connection);
        // console.log("publisher stream", publisher.stream);

        // make sure to unpublish the publisher from the session only if it exists
        if (publisher.stream) {
          session.unpublish(publisher);
        }
        publisher.off();
        publisher.destroy();
        console.log("session unpublished the publisher, publisher destroyed");
      }
    };
  }, [value, session]);

  if (error) {
    return <div>{error}</div>;
  }

  const canSendSignal = sendSignal && session;

  return (
    <>
      <div id="videos" key={value}>
        <div id="subscriber" />
        <div id="publisher" />
      </div>
      {signalText && <div style={{ marginTop: "10px" }}>{signalText}</div>}

      {/* <button
        style={{ marginTop: "10px" }}
        onClick={() => setValue((previousValue) => previousValue + 1)}
      >
        Add Value manually
      </button> */}
      {/* <screen-share
        start-text="start screen share"
        stop-text="stop screen share"
        width="300px"
        height="240px"
        ref={screenshare}
      ></screen-share> */}
      {canSendSignal && (
        <button
          onClick={() => {
            // console.log({ session });
            sendSignal(session);
          }}
        >
          Emit Signal
        </button>
      )}
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
