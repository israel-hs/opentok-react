import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <ul>
      <li>
        <Link to="/opentok-react/lobby/member">Member Lobby</Link>
      </li>
      <li>
        <Link to="/opentok-react/lobby/therapist">Therapist Lobby</Link>
      </li>
      <li>
        <Link to="/opentok-react/onboarding">Onboarding test</Link>
      </li>
    </ul>
  );
};

export default Home;
