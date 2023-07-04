import React, { useEffect } from "react";
import { StreamDestroyedEvent } from "./types";
import {
  createPublisherListernerMap,
  handleError,
  publisherProperties,
} from "./utils";

// Create a publisher (video & audio feed), this will create a stream
function createPublisher(
  audioSource: PublisherProps["audioSource"],
  videoSource: PublisherProps["videoSource"]
) {
  const publisherProps: OT.PublisherProperties = {
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
      console.log("streamDestroyed @ Publisher, reason:", event.reason);
      // this should prevent the publisher from being removed from the DOM
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
  // console.log("publisher getVideoSource:", publisher.getVideoSource());
  // console.log("videoSoutce:", videoSource);

  publisher
    .setVideoSource(videoSource)
    .then(() => console.log("video source set"))
    .catch((error) => {
      console.error(error.name);
      console.error(error.message);
    });
}

function setAudioSource(publisher: OT.Publisher, audioSource: string) {
  publisher
    .setAudioSource(audioSource)
    .then(() => console.log("audio source set"))
    .catch((error) => console.error(error.name));
}

interface PublisherProps {
  session?: OT.Session;
  audioSource: string;
  videoSource: string;
  publishToSession?: boolean;
  style?: React.CSSProperties;
  connectToSession?: () => void;
}

const Publisher: React.FC<PublisherProps> = ({
  session,
  audioSource,
  videoSource,
  publishToSession = true,
  style = {},
  connectToSession,
}) => {
  // const [error, setError] = React.useState("");
  // const [publisher, setPublisher] = React.useState<OT.Publisher>();
  let publisher: OT.Publisher | undefined;

  function unpublishPublisher() {
    if (publisher && publisher.stream) {
      session?.unpublish(publisher);
    }
  }

  useEffect(() => {
    if (!session) return;

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log(
          "publisher listened to sessionConnected event from session"
        );
        // debugger;
        publisher = createPublisher(audioSource, videoSource);
        // setPublisher(publisher);

        // We want to control whether we stream to the session or not
        // (e.g.: we don't want to publish when at the Lobby)
        if (publishToSession) {
          console.log("publisher about to publish to session", publisher);
          session.publish(publisher, handleError);
        }
      },
    });

    return () => {
      if (publisher) {
        // publisher.publishVideo(false);
        // publisher.publishAudio(false);

        // unpublish the publisher from the session only if it exists:
        // if (publisher.stream) {
        //   session?.unpublish(publisher);
        // }
        unpublishPublisher();
        publisher.off();
        publisher.destroy();
        publisher = undefined;
        console.log("Publisher destroyed");
      }
    };
  }, [session, publisher]);

  useEffect(() => {
    if (!publisher || !videoSource) return;
    setVideoSource(publisher, videoSource);
  }, [publisher, videoSource]);

  useEffect(() => {
    if (!publisher || !audioSource) return;
    setAudioSource(publisher, audioSource);
  }, [audioSource, publisher]);

  return (
    <>
      <div id="publisher" style={style} />
      <button
        style={{ position: "absolute", bottom: "-10%" }}
        onClick={() => {
          unpublishPublisher();
        }}
      >
        UnPublish
      </button>
      <button
        style={{ position: "absolute", bottom: "-15%" }}
        onClick={() => {
          if (!publisher) return;
          if (session?.isConnected()) {
            session?.publish(publisher, handleError);
          } else {
            connectToSession?.();
          }
        }}
      >
        Restart Publishing
      </button>
    </>
  );
};

export default Publisher;
