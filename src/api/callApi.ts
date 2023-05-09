export const removeMember = async (member: string) => {
  try {
    const result = await fetch(
      "https://opentok-node.onrender.com/remove-member",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ member }),
      }
    );

    if (!result.ok) throw Error("error while removing member");
  } catch (error) {
    throw error;
  }
};

// let publishers: string[] = [];

// export const addPublisher = (publisherId: string) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       publishers.push(publisherId);
//       console.log("publishers", publishers);
//       resolve({ result: "ok" });
//     }, 1500);
//   });
// };

// export const removePublisher = (publisherId: string) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       publishers = publishers.filter((pId) => pId !== publisherId);
//       resolve({ result: "ok" });
//     }, 1500);
//   });
// };

// export const getConnectedMembers = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       console.log("publishers", publishers);
//       resolve({ publishers });
//     }, 1500);
//   });
// };
