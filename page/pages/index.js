import { Box, ThemeProvider } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Post from "../comps/post";
import SquareButton from "../comps/squareButton";
import {
  useGetAllCliquesQuery,
  useGetPostsQuery,
} from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import CliqueSidebar from "../comps/cliqueSidebar";

function Home({ sort = "top", displaySize, ...props }) {
  const [{ data }] = useGetPostsQuery({
    variables: { sort },
  });
  const [{ data: allCliquesData }] = useGetAllCliquesQuery();

  const theme = props.theme;
  const router = useRouter();

  // todo: add sorting by comments
  const availableSorts = ["top", "new", "views", "random"];
  return (
    <Box
      sx={{
        display: "flex",
        margin: 1,
        paddingBottom: 5,
        minWidth: 305,
        gap: 1,
      }}
    >
      <Box
        id="posts-column"
        sx={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: ["xl", "lg"].includes(displaySize) ? "80%" : "100%",
          transition: `width 0.5s ease ${
            ["xl", "lg"].includes(displaySize) ? "0s" : "0.3s"
          }`,
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
              marginRight: 2,
            }}
          >
            <p style={{ margin: "auto", whiteSpace: "nowrap" }}>Sort by</p>
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
                  overflow: "hidden",
                }}
              >
                {sortType.toUpperCase()}
              </SquareButton>
            )
          )}
        </Box>
        {data &&
          data.getPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              theme={theme}
              showTopComment
              {...props}
            />
          ))}
      </Box>
      <Box
        id="cliques-column"
        sx={{
          padding: 0,
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          width: ["xl", "lg"].includes(displaySize) ? "20%" : "0%",
          overflow: "hidden",
          maxWidth: 200,
          minWidth: 0,
          background: theme.palette.background.paper,
          borderColor: theme.palette.background.border,
          borderWidth: ["xl", "lg"].includes(displaySize) ? 1 : 0,
          borderStyle: "solid",
          display: "flex",
          gap: 0.3,
          ":hover": {
            borderColor: theme.palette.background.focus,
          },
          transition:
            "width 0.5s, background-color 0.3s, opacity 0.3s, border-color 0.3s, color 0.3s",
          color: theme.palette.text.primary,
          px: ["xl", "lg"].includes(displaySize) ? 1.5 : 0,
          opacity: ["xl", "lg"].includes(displaySize) ? 1 : 0,
        }}
      >
        <Box sx={{ my: 1 }}>Recent cliques</Box>
        {allCliquesData?.getAllCliques &&
          allCliquesData.getAllCliques.map((clique) => (
            <CliqueSidebar
              key={clique.cliqueID}
              clique={clique}
              theme={theme}
            />
          ))}
      </Box>
    </Box>
  );
}

export default withUrqlClient(createUrqlClient)(Home);
