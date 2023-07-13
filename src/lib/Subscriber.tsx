import React, { useEffect } from "react";
import {
  callProperties,
  createSubscriberListenerMap,
  handleError,
} from "./utils";
import { OpentokSession, StreamCreatedEvent } from "./types";

interface SubscriberProps {
  session?: OpentokSession;
}

const subscribeToSession = (
  session: OpentokSession,
  streamToUse: OT.Stream
) => {
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
        subscriber = subscribeToSession(session, event.stream);
        if (!subscriber) return;

        const subscriberEvents = createSubscriberListenerMap();
        // remember we can do preventDefeault on the streamDestroyed event to
        // prevent the subscriber from being removed from the DOM
        subscriber.on({
          ...subscriberEvents,
          /**
           * This subsciber event is triggered when re-gaining connectivity after
           * losing connection locally. When the subscriber is destroyed it means
           * we cannot longer receive the stream from the other party. So, we ask
           * the other party to republish the stream to the session by sending a
           * signal.
           *
           * Bear in mind that this signal is only triggered if we  still have a
           * connected session after re-connecting. We need to do something else
           * if not.
           */
          destroyed: () => {
            console.log("subscriber destroyed");
            if (session && session.isConnected()) {
              console.log("sending republish signal");
              session.signal({ type: "republish" }, handleError);
            }
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
