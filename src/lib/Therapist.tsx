import React from "react";
// import Video from "./Video";
import Call from "./Call";

import type { User } from "./types";

// there might be some logic we want to incorporate to the Therapist
// as opposed to the Member
// const Therapist: React.FC<User> = ({ userId }) => {
const Therapist: React.FC<User> = () => {
  // return <Call userId={userId} />;
  return <Call />;
};

export default Therapist;
