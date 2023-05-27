import { useEffect, useState } from "react";
import { Devices } from "../types";

const useDevices = () => {
  const [videoDevices, setVideoDevices] = useState<Devices>([]);
  const [speakerDevices, setSpeakerDevices] = useState<Devices>([]);
  const [microphoneDevices, setMicrophoneDevices] = useState<Devices>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      const errorMessage = "enumerateDevices() not supported in this browser.";
      setError(errorMessage);
      console.log(errorMessage);
      return;
    }

    // List cameras and microphones.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const video: Devices = [];
        const speakers: Devices = [];
        const microphones: Devices = [];
        devices.forEach((device) => {
          switch (device.kind) {
            case "audioinput":
              microphones.push(device);
              break;
            case "audiooutput":
              speakers.push(device);
              break;
            case "videoinput":
              video.push(device);
          }
          // we are not retrieving any label when on Firefox, we need an alternative
          console.log(
            `${device.kind}: ${device.label} id = ${device.deviceId}`
          );
        });
        setVideoDevices(video);
        setSpeakerDevices(speakers);
        setMicrophoneDevices(microphones);
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }, []);

  // 'as const' makes sure that the values are constant, and not changeable
  // this affects the inferred returned type for this custom hook, see:
  // https://fettblog.eu/typescript-react-typeing-custom-hooks/
  return { videoDevices, speakerDevices, microphoneDevices, error } as const;
};

export default useDevices;
