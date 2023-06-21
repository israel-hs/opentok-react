import React, { useEffect } from "react";
import { StreamDestroyedEvent } from "./types";
import {
  createPublisherListernerMap,
  handleError,
  publisherProperties,
} from "./utils";

// function displayDevices() {
//   window.navigator.mediaDevices
//     .getUserMedia({ video: true, audio: true })
//     .then((mediaStream) => {
//       console.log("mediaStream stop tracks", mediaStream.getAudioTracks());
//       // mediaStream.getTracks().forEach((track) => track.stop());
//     });
// }

// Create a publisher (video & audio feed), this will create a stream
function createPublisher(
  audioSource: PublisherProps["audioSource"],
  videoSource: PublisherProps["videoSource"]
) {
  let publisherProps: OT.PublisherProperties = {
    ...publisherProperties,
    videoSource,
    audioSource,
  };

  const publisher = OT.initPublisher(
    "publisher",
    publisherProps,
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
    streamDestroyed: (event: StreamDestroyedEvent) => {
      console.log("streamDestroyed @ Publisher" /*, event*/);
      // following the docs, this should prevent the publisher from being removed from the DOM
      // https://tokbox.com/developer/sdks/js/reference/Session.html#unpublish
      // (not sure if this goes for the listener at the session)
      event.preventDefault();
      // if (event.reason === "mediaStopped") {
      //   // this is a screenshare stream
      //   // remove the screenshare element
      //   screenshare.current?.remove();
      // }
    },
  });
  return publisher;
}

function setVideoSource(publisher: OT.Publisher, videoSource: string) {
  publisher
    .setVideoSource(videoSource)
    .then(() => console.log("video source set"))
    .catch((error) => console.error(error.name));
}

function setAudioSource(publisher: OT.Publisher, audioSource: string) {
  publisher
    .setAudioSource(audioSource)
    .then(() => console.log("audio source set"))
    .catch((error) => console.error(error.name));
}

interface PublisherProps {
  session: OT.Session;
  audioSource: string;
  videoSource: string;
  publishToSession?: boolean;
  style?: React.CSSProperties;
}

const Publisher: React.FC<PublisherProps> = ({
  session,
  audioSource,
  videoSource,
  publishToSession,
  style = {},
}) => {
  // const [error, setError] = React.useState("");
  const [publisher, setPublisher] = React.useState<OT.Publisher>();

  useEffect(() => {
    if (!session) return;

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        const publisher = createPublisher(audioSource, videoSource);
        setPublisher(publisher);

        // We want to control whether we stream to the session or not
        // (e.g.: we don't want to publish when at the Lobby)
        if (publishToSession) {
          session.publish(publisher, handleError);
        }
      },
    });

    return () => {
      if (publisher) {
        // publisher.publishVideo(false);
        // publisher.publishAudio(false);

        // unpublish the publisher from the session only if it exists:
        if (publisher.stream) {
          session.unpublish(publisher);
        }
        publisher.off();
        publisher.destroy();
        console.log("session unpublished the publisher, publisher destroyed");
      }
    };
  }, [session, publisher]);

  // const deviceEventListener = (options: any) => {
  //   console.log("publisher", publisher);
  //   if (!publisher) return;
  //   const videoSource = options.detail.videoSource;
  //   const audioSource = options.detail.audioSource;
  //   console.log("video input selected", videoSource);
  //   console.log("audio input selected", audioSource);

  //   window.navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((mediaStream) => {
  //       console.log("mediaStream.getTracks()", mediaStream.getTracks());
  //       mediaStream.getTracks().forEach((track) => track.stop());
  //       setVideoSource(publisher, videoSource);
  //       // mediaStream.getTracks().forEach((track) => track.stop())
  //     });
  // };

  useEffect(() => {
    if (!publisher || !videoSource) return;
    setVideoSource(publisher, videoSource);
  }, [videoSource]);

  useEffect(() => {
    if (!publisher || !audioSource) return;
    setAudioSource(publisher, audioSource);
  }, [audioSource]);

  return <div id="publisher" style={style} />;
};

export default Publisher;
