import { Box } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comment from "../../comps/comment";
import PostComp from "../../comps/post";
import {
  useGetPostQuery,
  useGetPostTopLevelCommentsQuery,
  useViewPostMutation,
} from "../../src/generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

function Post({ theme, ...props }) {
  const router = useRouter();
  const { postID: rawPostID } = router.query;

  const [{ data, fetching }] = useGetPostQuery({
    variables: { id: parseInt(rawPostID) || -1 },
  });
  const [message, setMessage] = useState("");
  const [{ data: commentsData, fetching: fecthingComments }] =
    useGetPostTopLevelCommentsQuery({
      variables: { postID: parseInt(rawPostID) || -1 },
    });
  const [viewingPost, setViewingPost] = useState(false);
  const [didViewPost, setDidViewPost] = useState(false);
  const [, viewPost] = useViewPostMutation();

  useEffect(() => {
    async function view() {
      if (data?.post && !didViewPost && !viewingPost) {
        setViewingPost(true);
        const res = await viewPost({ postID: data.post.id });
        if (res.error || !res.data?.viewPost) {
          console.error(res.error);
          console.log(res.data);
          console.log(res);
        } else {
          setDidViewPost(true);
        }
        setViewingPost(false);
      }
    }
    view();
  }, [data]);

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
        // width:"100%",
        minWidth: 305,
      }}
    >
      <Box
        sx={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 742,
          minWidth: 280,
          p: 1,
          paddingBottom: 0.5,
          borderRadius: 2,
          background: theme.palette.background.commentArea,
          transition: "background 0.3s",
          color: theme.palette.text.primary,
        }}
      >
        {message !== "" && message}
        {data?.post && (
          <PostComp post={data.post} theme={theme} isSole {...props} />
        )}

        <Box sx={{ marginRight: 1, paddingTop: 0.5 }}>
          {commentsData &&
            commentsData.getPostTopLevelComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                theme={theme}
                post={data.post}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient)(Post);
