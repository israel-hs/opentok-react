import React from "react";
import OT from "@opentok/client";

import Call from "./Call";
import { handleError } from "./utils";
import type { CallProps } from "./types";

// See the documentation here to check what we can do with the signal:
// (we might need to specify the Connection we send the signal to)
// https://tokbox.com/developer/sdks/js/reference/Session.html#signal

// There might be some logic we want to incorporate to the Therapist
// as opposed to the Member. A Therapist can explicitly send a signal
// to the Member for example:
const Therapist: React.FC<CallProps> = ({ userId }) => {
  const sendSignal = (session: OT.Session) => {
    session.signal({ data: userId, type: "therapist" }, handleError);
  };

  return <Call userId={userId} sendSignal={sendSignal} />;
};

export default Therapist;
