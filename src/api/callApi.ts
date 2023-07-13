import { baseURL } from "../config";
import { RoomInfo } from "../lib/types";

export const addMember = async (memberId: string) => {
  try {
    const result = await fetch(`${baseURL}/add-member`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ member: memberId }),
    });

    if (!result.ok) throw Error("error while adding a member");
  } catch (error) {
    throw error;
  }
};

export const getMembers = async () => {
  try {
    const result = await fetch(`${baseURL}/get-members`);
    if (!result.ok) throw Error("error while retrieving members");
    return result.json();
  } catch (error) {
    throw error;
  }
};

export const removeMember = async (member: string) => {
  try {
    const result = await fetch(`${baseURL}/remove-member`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ member }),
    });

    if (!result.ok) throw Error("error while removing member");
  } catch (error) {
    throw error;
  }
};

export const getOpentokCredentials = async (
  roomId: number,
  signal?: AbortSignal
): Promise<RoomInfo> => {
  const response = await fetch(`${baseURL}/call-v2/room/${roomId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) throw Error("error while retrieving opentok credentials");
  return response.json();
};
