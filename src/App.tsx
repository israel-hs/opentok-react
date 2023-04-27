import React from "react";
import { Route, Routes } from "react-router-dom";
import Member from "./lib/Member";
import Therapist from "./lib/Therapist";
import Home from "./Home";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/opentok-react" element={<Home />} />
      <Route path="/opentok-react/member" element={<Member />} />
      <Route path="/opentok-react/therapist" element={<Therapist />} />
    </Routes>
  );
};

export default App;
