import { Box, ThemeProvider } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import MenuButton from "../comps/menuButton";
import Post from "../comps/post";
import { useField } from "../comps/useField";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Home(props) {
  const router = useRouter();
  const [{ data }] = usePostsQuery();

  const theme = props.theme;

  const [creatingPost, setCreatingPost] = useState(false);
  const [sending, setSending] = useState(false);

  const post = {
    title: useField((value) => value.length < 3), // alphanumeric+`_` starting with letter
    content: useField(() => false),
    set: (e) => {
      post[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || post[e.target.name].error === true) {
        post[e.target.name].validate(e.target.value);
      }
      // setAlertStatus("false");
      // setButtonColor("primary");
    },
    reset: () => {
      post.title.set("");
      post.content.set("");
      post.content.setError(false);
    },
    validate: () => {
      return [post.title.validate(), post.content.validate()];
    },
  };

  const handleSubmit = () => {
    setSending(true);

    setTimeout(() => setSending(false), 200);
  };

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
          <MenuButton
            theme={theme}
            onClick={() => {
              setCreatingPost(!creatingPost);
              router.push("/submit");
            }}
          >
            Create Post
          </MenuButton>
          {data &&
            data.posts.map((post) => (
              <Post key={post.id} post={post} theme={theme} showTopComment />
            ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
