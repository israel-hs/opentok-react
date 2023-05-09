import React from "react";
import Video from "./Video";

import { User } from "./types";

// there might be some logic we want to incorporate to the Member
// as opposed to the Therapist
const Member: React.FC<User> = ({ userId }) => {
  return <Video userId={userId} />;
};

export default Member;
