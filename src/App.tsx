import React from "react";
import { Route, Routes } from "react-router-dom";
import Member from "./lib/Member";
import Therapist from "./lib/Therapist";
import Home from "./Home";
// import Lobby from "./lib/Lobby";
import { useNavigate } from "react-router-dom";

import GetMediaLobby from "./lib/GetMediaLobby";

const memberName = "John Kennedy";
const therapistName = "Nikita Khrushev";

const App: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (route: "member" | "therapist") => {
    navigate(`/opentok-react/${route}`);
  };

  return (
    <Routes>
      <Route path="/opentok-react" element={<Home />} />
      <Route
        path="/opentok-react/lobby/member"
        element={
          <GetMediaLobby
            memberId={memberName}
            addToCall={() => navigateTo("member")}
          />
        }
      />
      <Route
        path="/opentok-react/lobby/therapist"
        element={
          <GetMediaLobby
            memberId={therapistName}
            addToCall={() => navigateTo("therapist")}
          />
        }
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
  // return (
  //   <Routes>
  //     <Route path="/opentok-react" element={<Home />} />
  //     <Route
  //       path="/opentok-react/lobby/member"
  //       element={<Lobby memberId="John Kennedy" type={"member"} />}
  //     />
  //     <Route
  //       path="/opentok-react/lobby/therapist"
  //       element={<Lobby memberId="Nikita Khrushev" type={"therapist"} />}
  //     />
  //     <Route
  //       path="/opentok-react/member"
  //       element={<Member userId="John Kennedy" />}
  //     />
  //     <Route
  //       path="/opentok-react/therapist"
  //       element={<Therapist userId="Nikita Khrushev" />}
  //     />
  //   </Routes>
  // );
};

export default App;
