import { Box } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comment from "../../../comps/comment";
import PostComp from "../../../comps/post";
import {
  useGetPostQuery,
  useGetPostTopLevelCommentsQuery,
} from "../../../src/generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

function Post({ theme }) {
  const router = useRouter();
  const { postID: rawPostID } = router.query;
  const [{ data, fetching }] = useGetPostQuery({
    variables: { id: parseInt(rawPostID) },
  });
  const [message, setMessage] = useState("");
  const [{ data: commentsData, fetching: fecthingComments }] =
    useGetPostTopLevelCommentsQuery({
      variables: { postID: parseInt(rawPostID) },
    });
  console.log(commentsData);
  useEffect(() => {
    if (rawPostID === "[deleted]") {
      setMessage("That post is deleted");
    } else if (fetching) {
      setMessage("");
    } else if (!data?.post) {
      setMessage("Post doesn't exist.");
      // post is alive and well
    } else {
      setMessage("");
    }
  }, [fetching, data, rawPostID]);

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
          borderRadius: 2,
          background: theme.palette.background.commentArea,
        }}
      >
        {message !== "" && message}
        {data && <PostComp post={data.post} theme={theme} commenting/>}
        {commentsData &&
          commentsData.getPostTopLevelComments.map((comment) => (
            <Comment key={comment.id} comment={comment} theme={theme} />
          ))}
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
