import { Box, ThemeProvider } from "@mui/material";
import { withUrqlClient } from "next-urql";
import React from "react";
import Post from "../comps/post";
import { useGetPostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Home(props) {
  const [{ data }] = useGetPostsQuery();
  const theme = props.theme;

  return (
    <ThemeProvider theme={theme}>
      <Box
        id="posts-column"
        sx={{ display: "flex", margin: 1, paddingBottom: 5 }}
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
        >
          {data &&
            data.getPosts.map((post) => (
              <Post key={post.id} post={post} theme={theme} showTopComment />
            ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient)(Home);
