import React from "react";
import Call from "./Call";
import { CallProps } from "./types";

// there might be some logic we want to incorporate to the Member
// as opposed to the Therapist
const Member: React.FC<CallProps> = ({ userId }) => {
  return <Call userId={userId} />;
};

export default Member;
