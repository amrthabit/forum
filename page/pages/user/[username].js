import { Box } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../../utils/createUrqlClient";
import {
  useGetUserFromUsernameQuery,
  useGetUserPostedsQuery,
} from "../../src/generated/graphql";
import msToString from "../../utils/msToString";
import { useEffect, useState } from "react";
import Post from "../../comps/post";

function User({ theme }) {
  const router = useRouter();
  const { username } = router.query;
  const [{ data, fetching }] = useGetUserFromUsernameQuery({
    variables: { username },
  });
  const [{ data: postedsData, fetching: fetchingPosteds }] =
    useGetUserPostedsQuery({
      variables: { posterID: data?.getUserFromUsername?.id },
    });
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    if (username === "[deleted]") {
      setMessage("That user is deleted");
    } else if (fetching) {
      setMessage("Loading...");
    } else if (!data?.getUserFromUsername) {
      setMessage("User doesn't exist.");
      // user is alive and well
    } else {
      setMessage(`@${data.getUserFromUsername.userID}
      Name: ${data.getUserFromUsername.firstName} ${
        data.getUserFromUsername.lastName
      }
      Age: ${msToString(data.getUserFromUsername.createdAt)}
      
      Posts:`);
    }
  }, [fetching, data]);

  return (
    <Box
      id="posts-column"
      sx={{
        color: theme.palette.text.primary,
        whiteSpace: "pre-line",
        display: "flex",
        margin: 1,
        paddingBottom: 5,
      }}
    >
      <Box
        sx={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 740,
        }}
      > {message}
        {postedsData &&
          postedsData.getUserPosteds.map((post) => (
            <Post post={post} theme={theme} key={post.id} />
          ))}
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
