import React from "react";
import { Route, Routes } from "react-router-dom";
import Member from "./lib/Member";
import Therapist from "./lib/Therapist";
import Home from "./Home";
import Lobby from "./lib/Lobby";

//research: how can an HOC access data from a child? maybe a hook?
// it'd be better to do something like:
/**
 * <Lobby>
 *   <Member>
 * </Lobby>
 */
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/opentok-react" element={<Home />} />
      <Route
        path="/opentok-react/lobby/member"
        element={<Lobby memberId="John Kennedy" type={"member"} />}
      />
      <Route
        path="/opentok-react/lobby/therapist"
        element={<Lobby memberId="Nikita Khrushev" type={"therapist"} />}
      />
      <Route
        path="/opentok-react/member"
        element={<Member userId="John Kennedy" />}
      />
      <Route
        path="/opentok-react/therapist"
        element={<Therapist userId="Nikita Khrushev" />}
      />
    </Routes>
  );
};

export default App;
