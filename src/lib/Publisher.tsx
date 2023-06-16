import React, { useEffect } from "react";
import { StreamDestroyedEvent } from "./types";
import {
  createPublisherListernerMap,
  handleError,
  publisherProperties,
} from "./utils";

// Create a publisher (video & audio feed), this will create a stream
function createPublisher(audioSource: string, videoSource: string) {
  const publisherProps: OT.PublisherProperties = {
    ...publisherProperties,
    audioSource,
    videoSource,
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
  publishToSession = true,
  style = {},
}) => {
  let publisher: OT.Publisher;

  useEffect(() => {
    if (!session) return;

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        publisher = createPublisher(audioSource, videoSource);

        // We want to control whethe we make the stream available to the session or not
        // (we don't weant to publish when we are at the Lobby for example)
        if (publishToSession) {
          session.publish(publisher, handleError);
        }
      },
    });

    () => {
      if (publisher) {
        // console.log("publisher stream", publisher.stream);
        // unpublish the publisher from the session only if it exists:
        if (publisher.stream) {
          session.unpublish(publisher);
        }
        publisher.off();
        publisher.destroy();
        console.log("session unpublished the publisher, publisher destroyed");
      }
    };
  }, [session]);

  return <div id="publisher" style={style} />;
};

export default Publisher;
