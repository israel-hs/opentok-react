import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Publisher from "./Publisher";
import type { Member } from "./types";
import DeviceSelect from "./DeviceSelect";
import useDevices from "./hooks/useDevices";
import useOpentokSession from "./hooks/useOpentokSession";

import "./devices.css";

import "@vonage/inputs-select/inputs-select.js";

/**
 * This component is meant to wrap a Video component and initially
 * check if someone else is connected (publishing) already.
 *
 * It is meant to be extended to do other stuff like checking media
 * configuration before letting the user jump into a call.
 */

interface LobbyProps {
  memberId: Member;
  linkTo: string;
}

type DeviceId = MediaDeviceInfo["deviceId"];

// create a new react component that allows the styles attribute to be passed in
// const StyledPublisher = styled(Publisher)<{ styles?: React.CSSProperties }>`

const Lobby: React.FC<LobbyProps> = ({ /*memberId,*/ linkTo }) => {
  const { videoDevices, microphoneDevices /*,error*/ } = useDevices();

  const [video, setVideo] = useState<DeviceId>();
  // const [speakers, setSpeakers] = useState<DeviceId>();
  const [microphone, setMicrophone] = useState<DeviceId>();

  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const { opentokSession: session, error: sessionError } = useOpentokSession();

  useEffect(() => {
    if (!videoDevices.length || !microphoneDevices.length) return;
    setVideo(videoDevices[0].deviceId);
    setMicrophone(microphoneDevices[0].deviceId);
  }, [videoDevices, microphoneDevices]);

  // useEffect(() => {
  //   // if (!videoDevices.length || !microphoneDevices.length) return;

  //   // setVideo(videoDevices[0].deviceId);
  //   // setMicrophone(microphoneDevices[0].deviceId);

  //   window.addEventListener("inputsSelected", (options: any) => {
  //     console.log("video input selected", options.detail.videoSource);
  //     console.log("audio input selected", options.detail.audioSource);
  //     setVideo(options.detail.videoSource);
  //     setMicrophone(options.detail.audioSource);
  //   });

  //   return () => {
  //     window.removeEventListener("inputsSelected", (options) => {
  //       console.log("inputsSelected removed", options);
  //     });
  //   };
  // }, []);
  //}, [videoDevices, microphoneDevices]);

  const allDevicesAvailable = !!video && !!microphone; // && !!speakers

  if (sessionError) {
    return (
      <div>
        There was an error connecting to the session. Please try again later.
      </div>
    );
  }

  // console.log("video", video);
  // console.log("microphone", microphone);
  console.log("allDevicesAvailable", allDevicesAvailable);

  if (!session || !allDevicesAvailable) {
    return <div id="publisher" />;
  }

  return (
    <>
      {
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Publisher
            session={session}
            publishToSession={false}
            audioSource={microphone}
            videoSource={video}
            style={{ position: "unset" }}
          />
          <div id="devices">
            {videoDevices.length > 0 && (
              <DeviceSelect
                label={"Pick your video input"}
                devices={videoDevices}
                updateDeviceId={setVideo}
              />
            )}
            {microphoneDevices.length > 0 && (
              <DeviceSelect
                label={"Pick your audio input"}
                devices={microphoneDevices}
                updateDeviceId={setMicrophone}
              />
            )}
            {/* {speakerDevices.length > 0 && (
              <DeviceSelect
                label={"Pick your audio output"}
                devices={speakerDevices}
                updateDeviceId={setSpeakers}
              />
            )} */}
            {/* <inputs-select
              audio-label="Audio Inputs:"
              video-label="Video Inputs:"
              button-text="Update selection"
            ></inputs-select> */}
          </div>
          <Link
            to={`/opentok-react/${linkTo}`}
            state={{
              videoDeviceId: video,
              microphoneDeviceId: microphone,
            }}
          >
            <button /*disabled={!allDevicesAvailable}*/
            >{`Go to ${linkTo}`}</button>
          </Link>
        </div>
      }
    </>
  );
};

export default Lobby;

// wrap Publisher component in a styled component and specify a width and height
// const StyledPublisher = styled(Publisher)`
//   width: 150px;
//   height: 250px;
// `;

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       "inputs-select": React.DetailedHTMLProps<
//         React.HTMLAttributes<HTMLElement>,
//         HTMLElement
//       >;
//     }
//   }
// }
