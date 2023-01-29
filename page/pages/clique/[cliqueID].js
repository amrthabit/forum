import { Box } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Comment from "../../comps/comment";
import Post from "../../comps/post";
import PostComp from "../../comps/post";
import {
  useGetCliqueFromCliqueIdQuery,
  useGetPostsQuery,
} from "../../src/generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

function Clique({ theme, ...props }) {
  const router = useRouter();
  const { cliqueID: cliqueID } = router.query;

  const [{ data, fetching }] = useGetCliqueFromCliqueIdQuery({
    variables: { cliqueID: cliqueID || "" },
  });
  const [message, setMessage] = useState("");
  // const [{ data: commentsData, fetching: fecthingComments }] =
  //   useGetPostTopLevelCommentsQuery({
  //     variables: { cliqueID: cliqueID || "" },
  //   });
  // const [viewingPost, setViewingPost] = useState(false);
  // const [didViewPost, setDidViewPost] = useState(false);
  // const [, viewPost] = useViewPostMutation();

  // useEffect(() => {
  //   async function view() {
  //     if (data?.post && !didViewPost && !viewingPost) {
  //       setViewingPost(true);
  //       const res = await viewPost({ cliqueID: data.post.id });
  //       if (res.error || !res.data?.viewPost) {
  //         console.error(res.error);
  //         console.log(res.data);
  //         console.log(res);
  //       } else {
  //         setDidViewPost(true);
  //       }
  //       setViewingPost(false);
  //     }
  //   }
  //   view();
  // }, [data]);

  useEffect(() => {
    if (cliqueID === "[deleted]") {
      setMessage("That clique is deleted");
    } else if (fetching) {
      setMessage("");
    } else if (!data?.getCliqueFromCliqueID) {
      setMessage(`Clique ${cliqueID} doesn't exist.`);
      // clique is alive and well
    } else {
      setMessage("");
    }
  }, [fetching, data, cliqueID]);

  const [{ data: postsData }] = useGetPostsQuery({
    variables: { clique: cliqueID },
  });

  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Box
        id="posts-column"
        sx={{
          margin: "auto",
          color: theme.palette.text.primary,
          whiteSpace: "pre-line",
          paddingBottom: 5,
          width: "100%",
          maxWidth: 742,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          padding: 1,
        }}
      >
        {message}
        {postsData &&
          postsData.getPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              theme={theme}
              showTopComment
              {...props}
            />
          ))}
        {/* <Box
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
      </Box> */}
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient)(Clique);
