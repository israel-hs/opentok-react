import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Member from "./lib/Member";
import Therapist from "./lib/Therapist";
import GetMediaLobby from "./lib/GetMediaLobby";

const memberName = "John Kennedy";
const therapistName = "Nikita Khrushev";

const App: React.FC = () => (
  <Routes>
    <Route path="/opentok-react" element={<Home />} />
    <Route
      path="/opentok-react/lobby/member"
      element={<GetMediaLobby memberId={memberName} linkTo="member" />}
    />
    <Route
      path="/opentok-react/lobby/therapist"
      element={<GetMediaLobby memberId={therapistName} linkTo="therapist" />}
    />
    <Route
      path="/opentok-react/member"
      element={<Member userId={memberName} />}
    />
    <Route
      path="/opentok-react/therapist"
      element={<Therapist userId={therapistName} />}
    />
  </Routes>
);

export default App;
