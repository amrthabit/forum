import { useUserQuery } from "../src/generated/graphql";

export const getUsernameFromID = (id) => {
  const [{ data: userData, fetching }] = useUserQuery({
    variables: { id: id || -1 },
  });

  if (userData?.user) {
    return userData.user.userID;
  }
  return "[deleted]";
};
