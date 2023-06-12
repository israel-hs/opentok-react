import OT from "@opentok/client";
import { addMember } from "../api/callApi";
import { CallProps, StreamCreatedEvent } from "./types";
import React, { useEffect, useState, useRef } from "react";
import {
  callProperties,
  createSubscriberListenerMap,
  handleError,
} from "./utils";

import Publisher from "./Publisher";
import "@vonage/screen-share/screen-share.js";
import useOpentokSession from "./hooks/useOpentokSession";
import { styled } from "styled-components";

const Call: React.FC<CallProps> = ({ userId, sendSignal }) => {
  const [value] = useState(0);
  const { opentokSession: session, signalText, error } = useOpentokSession();

  const screenshare = useRef<
    HTMLElement & { session: OT.Session; token: string }
  >(null);

  // let stream: OT.Stream | null;
  let subscriber: OT.Subscriber | undefined;

  const subscribeToSession = (session: OT.Session, streamToUse: OT.Stream) => {
    return session.subscribe(
      streamToUse,
      "subscriber",
      callProperties,
      handleError
    );
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
    };
  }, [value, session]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!session) {
    return (
      <div id="videos">
        <div id="subscriber" />
        <div id="publisher" />
      </div>
    );
  }

  const canSendSignal = sendSignal && session;

  return (
    <>
      <div id="videos" key={value}>
        <Publisher session={session} />
        <div id="subscriber" />
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

// const StyledPublisher = styled(Publisher)`
//   .publisher {
//     position: absolute;
//     width: 150px;
//     height: 250px;
//     top: 15px;
//     left: 15px;
//     z-index: 100;
//     border: 3px solid white;
//     border-radius: 3px;
//   }
// `;

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
