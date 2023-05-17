import React from "react";

import Call from "./Call";
import type { CallProps } from "./types";

// there might be some logic we want to incorporate to the Therapist
// as opposed to the Member
const Therapist: React.FC<CallProps> = ({ userId }) => {
  return <Call userId={userId} />;
};

export default Therapist;
