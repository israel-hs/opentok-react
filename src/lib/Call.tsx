import OT from "@opentok/client";
import { CallProps } from "./types";
import { addMember } from "../api/callApi";
import React, { useEffect, useRef } from "react";

import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import "@vonage/screen-share/screen-share.js";
import useOpentokSession from "./hooks/useOpentokSession";
import { useLocation } from "react-router-dom";
// import { styled } from "styled-components";

const Call: React.FC<CallProps> = ({ userId, sendSignal }) => {
  const location = useLocation();

  const { videoDeviceId, microphoneDeviceId } = location.state || {};
  const { opentokSession: session, signalText, error } = useOpentokSession();

  console.log({ videoDeviceId, microphoneDeviceId });

  const screenshare = useRef<
    HTMLElement & { session: OT.Session; token: string }
  >(null);

  // let stream: OT.Stream | null;
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
    };
  }, [session]);

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
      <div id="videos">
        <Publisher
          session={session}
          videoSource={videoDeviceId}
          audioSource={microphoneDeviceId}
        />
        <Subscriber session={session} />
      </div>
      {signalText && <div style={{ marginTop: "10px" }}>{signalText}</div>}
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
