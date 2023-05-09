import React from "react";
import Video from "./Video";

import type { User } from "./types";

// there might be some logic we want to incorporate to the Therapist
// as opposed to the Member
const Therapist: React.FC<User> = ({ userId }) => {
  return <Video userId={userId} />;
};

export default Therapist;
