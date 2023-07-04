import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { CallProps } from "./types";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import useOpentokSession from "./hooks/useOpentokSession";

import "@vonage/screen-share/screen-share.js";

const Call: React.FC<CallProps> = ({ sendSignal }) => {
  const location = useLocation();

  const { videoDeviceId, microphoneDeviceId } = location.state || {};
  const {
    opentokSession: session,
    connectToSession,
    // signalText,
    // error,
  } = useOpentokSession(false);
  // const [key, setKey] = useState(0);

  // console.log({ videoDeviceId, microphoneDeviceId });

  // const screenshare = useRef<
  //   HTMLElement & { session: OT.Session; token: string }
  // >(null);

  // let stream: OT.Stream | null;

  useEffect(() => {
    if (!session) return;

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
      // console.log("unmounting component");
      // this is not working: this cleanup function is invoked after unmount
      // therefore screenshare.current reference is already null:
      // if (screenshare.current) {
      //   screenshare.current?.remove();
      //   // (screenshare.current as any).disconnectedCallback();
      // }
    };
  }, [session]);

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (!session) {
  //   return (
  //     <div id="videos">
  //       <div id="subscriber" />
  //       <div id="publisher" />
  //     </div>
  //   );
  // }

  const canSendSignal = sendSignal && session;

  return (
    <>
      <div id="videos">
        <Publisher
          session={session}
          videoSource={videoDeviceId}
          audioSource={microphoneDeviceId}
          connectToSession={connectToSession}
        />
        <Subscriber session={session} />
      </div>
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

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "screen-share": React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement>,
//         HTMLElement
//       > & {
//         width: string;
//         height: string;
//       };
//     }
//   }
// }
