import React, { useRef, useEffect } from "react";
import { apiKey, token, sessionId } from "../opentok.config";

import "@vonage/video-publisher/video-publisher.js";

function App() {
  // Get references to Web Components
  const publisher = useRef<HTMLElement & { session: any; token: any }>(null);
  // const subscribers = useRef(null);
  // const screenshare = useRef(null);

  useEffect(() => {
    debugger;
    const OT = window.OT;

    // Initialize an OpenTok Session object
    const session = OT.initSession(apiKey, sessionId);

    // Set session and token for Web Components
    publisher.current!.session = session;
    publisher.current!.token = token;
  });

  return (
    <video-publisher
      width="360px"
      height="240px"
      ref={publisher}
    ></video-publisher>
  );
}

export default App;

// import React, { useEffect, useRef } from "react";
// import type { User } from "./types";
// import { addMember } from "../api/callApi";
// import OT from "@opentok/client";

// import "@vonage/video-publisher/video-publisher.js";
// import { apiKey, token, sessionId } from "../opentok.config";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "video-publisher": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        width: string;
        height: string;
      };
    }
  }
}

// const Call: React.FC<User> = ({ userId }) => {
//   const publisher = useRef<HTMLElement>(null);

//   useEffect(() => {
//     // Initialize an OpenTok Session object
//     const session = OT.initSession(apiKey, sessionId);

//     // let initialSession: OT.Session;
//     // let initialPublisher: OT.Publisher;

//     // Set session and token for Web Components
//     if (publisher.current) {
//       publisher.current.session = session;
//       publisher.current.token = token;
//     }

//     const addMemberToCall = async () => {
//       try {
//         await addMember(userId);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     addMemberToCall();
//   }, [publisher]);

//   return (
//     <video-publisher
//       width="360px"
//       height="240px"
//       ref={publisher}
//     ></video-publisher>
//   );
// };

// export default Call;
