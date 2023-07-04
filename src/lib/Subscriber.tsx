import React, { useEffect } from "react";
import {
  callProperties,
  createSubscriberListenerMap,
  handleError,
} from "./utils";
import { StreamCreatedEvent } from "./types";

interface SubscriberProps {
  session?: OT.Session;
}

const subscribeToSession = (session: OT.Session, streamToUse: OT.Stream) => {
  return session.subscribe(
    streamToUse,
    "subscriber",
    callProperties,
    handleError
  );
};

const Subscriber: React.FC<SubscriberProps> = ({ session }) => {
  let subscriber: OT.Subscriber | undefined;

  function destroySubscriber() {
    if (subscriber && subscriber.stream) {
      session?.unsubscribe(subscriber);
    }
  }

  useEffect(() => {
    if (!session) return;

    session.on({
      streamCreated: (event: StreamCreatedEvent) => {
        // Subscribe to a newly created stream
        console.log("streamCreated", event);
        // debugger;
        subscriber = subscribeToSession(session, event.stream);
        if (!subscriber) return;

        const subscriberEvents = createSubscriberListenerMap();
        // remember we can do preventDefeault on the streamDestroyed event to
        // prevent the subscriber from being removed from the DOM
        subscriber.on({
          ...subscriberEvents,
          disconnected: () => {
            console.log("subscriber disconnected");
            // if (subscriber?.stream) {
            //   session.unsubscribe(subscriber);
            // }
          },
        });
      },
    });

    return () => {
      if (subscriber) {
        // if (subscriber.stream) {
        //   session.unsubscribe(subscriber); // what if the session is already destroyed?
        // }
        destroySubscriber();
        // don't we need to destroy the subscriber? I haven't found any recommendations on this on the docs
        // check this: https://tokbox.com/developer/sdks/js/reference/Subscriber.html#destroy
        subscriber.off();
        subscriber = undefined;
        console.log("Subscriber destroyed");
      }
    };
  }, [session]);

  return (
    <div>
      <div id="subscriber" />
      <button
        style={{ position: "absolute", bottom: "-5%", zIndex: "200" }}
        onClick={() => {
          destroySubscriber();
        }}
      >
        Destroy Subscriber
      </button>
    </div>
  );
};

export default Subscriber;
