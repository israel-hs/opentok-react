import React from "react";
// import Video from "./Video";
import Call from "./Call";

import { User } from "./types";

// there might be some logic we want to incorporate to the Member
// as opposed to the Therapist
// const Member: React.FC<User> = ({ userId }) => {
const Member: React.FC<User> = () => {
  // return <Call userId={userId} />;
  return <Call />;
};

export default Member;
