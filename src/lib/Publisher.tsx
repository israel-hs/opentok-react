import React, { useEffect } from "react";
import { StreamDestroyedEvent } from "./types";
import {
  callProperties,
  createPublisherListernerMap,
  handleError,
} from "./utils";

// Create a publisher (video & audio feed), this will create a stream
function createPublisher() {
  const publisher = OT.initPublisher(
    "publisher",
    callProperties,
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
    streamDestroyed: (_event: StreamDestroyedEvent) => {
      console.log("streamDestroyed @ Publisher" /*, event*/);
      // following the docs, this should prevent the publisher from being removed from the DOM
      // https://tokbox.com/developer/sdks/js/reference/Session.html#unpublish
      // (not sure if this goes for the listener at the session)
      // event.preventDefault();
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
}

const Publisher: React.FC<PublisherProps> = ({ session }) => {
  let publisher: OT.Publisher;

  useEffect(() => {
    if (!session) return;

    session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: () => {
        console.log("on session connected");
        publisher = createPublisher();
        session.publish(publisher, handleError);
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

  return <div id="publisher" />;
};

export default Publisher;
