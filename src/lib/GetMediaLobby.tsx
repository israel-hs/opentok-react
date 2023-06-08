import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import DeviceSelect from "./DeviceSelect";
import useDevices from "./hooks/useDevices";
import type { Member, Members } from "./types";
import { getMembers, removeMember } from "../api/callApi";

import "./devices.css";

// import "@vonage/inputs-select/inputs-select.js";

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

const Lobby: React.FC<LobbyProps> = ({ memberId, linkTo }) => {
  const { videoDevices, speakerDevices, microphoneDevices, error } =
    useDevices();

  const [video, setVideo] = useState<DeviceId>();
  const [speakers, setSpeakers] = useState<DeviceId>();
  const [microphone, setMicrophone] = useState<DeviceId>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectedMembers, setConnectedMembers] = useState<Member[]>([]);

  useEffect(() => {
    setIsLoading(true);
    let interval: number;
    const removeMemberAndPoll = async () => {
      // first make sure that a member that is in the lobby doesn't exist in a call
      await removeMember(memberId);

      // poll data from the server every 2 secs
      interval = setInterval(async () => {
        try {
          const { members }: Members = await getMembers();
          setConnectedMembers(members);
          setIsLoading(false);
          // console.log("members", members);
        } catch (error) {
          console.error(error);
        }
      }, 2000);
    };

    removeMemberAndPoll();

    return () => {
      clearInterval(interval);
    };
  }, []);

  const membersList = connectedMembers.map((member) => (
    <li key={member}>{member}</li>
  ));

  const allDevicesAvailable = !!video && !!speakers && !!microphone;

  return (
    <>
      {isLoading ? (
        <div>Loading data...</div>
      ) : (
        <>
          {connectedMembers.length ? (
            <div>
              The following members are already in the call:
              <ul>{membersList}</ul>
            </div>
          ) : (
            <div>There are no connected members</div>
          )}
        </>
      )}

      {!error && (
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
          {speakerDevices.length > 0 && (
            <DeviceSelect
              label={"Pick your audio output"}
              devices={speakerDevices}
              updateDeviceId={setSpeakers}
            />
          )}
          {/* <inputs-select
          audio-label="Audio Inputs:"
          video-label="Video Inputs:"
          button-text="Preview"
        ></inputs-select> */}
        </div>
      )}

      {!isLoading && !error && (
        <Link to={`/opentok-react/${linkTo}`}>
          <button disabled={allDevicesAvailable}>{`Go to ${linkTo}`}</button>
        </Link>
      )}
    </>
  );
};

export default Lobby;

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
