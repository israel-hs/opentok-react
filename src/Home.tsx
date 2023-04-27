import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <ul>
      <li>
        <Link to="/opentok-react/member">Member</Link>
      </li>
      <li>
        <Link to="/opentok-react/therapist">Therapist</Link>
      </li>
    </ul>
  );
};

export default Home;
