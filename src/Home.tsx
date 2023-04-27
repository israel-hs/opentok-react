import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <ul>
      <li>
        <Link to="/member">Member</Link>
      </li>
      <li>
        <Link to="/therapist">Therapist</Link>
      </li>
    </ul>
  );
};

export default Home;
