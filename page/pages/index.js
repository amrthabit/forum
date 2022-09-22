import { Box, ThemeProvider } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Post from "../comps/post";
import SquareButton from "../comps/squareButton";
import { useGetPostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Home({ sort = "top", ...props }) {
  const [{ data }] = useGetPostsQuery({
    variables: { sort },
  });
  const theme = props.theme;
  const router = useRouter();
  // todo: add sorting by comments
  const availableSorts = ["top", "new", "views", "random"];
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
          <Box // sorting buttons container
            sx={{
              background: theme.palette.background.paper,
              borderColor: theme.palette.background.border,
              borderWidth: 1,
              borderStyle: "solid",
              padding: 1,
              borderRadius: 2,
              display: "flex",
              gap: 1,
              ":hover": {
                borderColor: theme.palette.background.focus,
              },
              transition: "all 0.3s",
            }}
          >
            <Box
              sx={{
                color: theme.palette.text.primary,
                transition: "all 0.3s",
                display: "flex",
                marginTop: -0.4,
                marginLeft: 1,
                marginRight: 2
              }}
            >
              <p style={{margin: "auto" }}>Sort by</p>
            </Box>
            {availableSorts.map(
              (
                sortType // sorting buttons
              ) => (
                <SquareButton
                  key={sortType}
                  theme={theme}
                  onClick={() => router.push(`/${sortType}`)}
                  loading={false}
                  interacting={true}
                  sx={{
                    width: 100,
                    height: 30,
                    ...(sortType === sort && {
                      borderColor: theme.palette.primary.main,
                    }),
                    borderRadius: 1,
                  }}
                >
                  {sortType.toUpperCase()}
                </SquareButton>
              )
            )}
          </Box>
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
