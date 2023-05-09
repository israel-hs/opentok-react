import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getConnectedMembers, addPublisher } from "../api/callApi";
import { baseURL } from "../config";
import type { Members } from "./types";

/**
 * This component is meant to wrap a Video component and initially
 * check if someone else is connected (publishing) already.
 *
 * It is meant to be extended to do other stuff like checking media
 * configuration before letting the user jump into a call.
 */

interface LobbyProps {
  memberId: string;
  type: "member" | "therapist";
}

const Lobby: React.FC<LobbyProps> = ({ memberId, type }) => {
  const navigate = useNavigate();
  const [connectedMembers, setConnectedMembers] = useState<Members["members"]>(
    []
  );

  useEffect(() => {
    // poll data from the server every 2 secs
    const interval = setInterval(async () => {
      fetch(`${baseURL}/get-members`)
        .then((response) => (response.ok ? response.json() : new Error("")))
        .then(({ members }: Members) => {
          console.log(members);
          setConnectedMembers(members);
        })
        .catch((error) => console.error(error));
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const addToCall = () => {
    // try {
    // await addPublisher(memberId);
    navigate(`/opentok-react/${type}`, { state: { memberId } });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const membersList = connectedMembers.map((member) => <li>{member}</li>);

  return (
    <>
      {connectedMembers.length ? (
        <ul>{membersList}</ul>
      ) : (
        <div>There are no connected members</div>
      )}
      <button onClick={addToCall}>Call</button>
    </>
  );
};

export default Lobby;
