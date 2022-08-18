import React, { useState } from "react";
import { usePostsQuery } from "../src/generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Box, Collapse, TextField } from "@mui/material";
import MenuButton from "../comps/menuButton";
import { useField } from "../comps/useField";
import Button from "../comps/button";

function Home(props) {
  const [{ data }] = usePostsQuery();
  const theme = props.theme;

  const [creatingPost, setCreatingPost] = useState(false);

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

  return (
    <>
      <Box
        id="posts-column"
        sx={{ background: "#3477b222", display: "flex", margin: 1 }}
      >
        <Box
          sx={{
            margin: "auto",
            background: "#c4303080",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            maxWidth: 740,
            height: 100,
            "> Post": { margin: "auto", borderRadius: 2 },
          }}
        >
          <MenuButton
            theme={theme}
            onClick={() => {
              setCreatingPost(!creatingPost);
            }}
          >
            Create Post
          </MenuButton>
          <Collapse
            in={creatingPost}
            sx={{
              transition: "all 0.3s",
            }}
          >
            <Box
              sx={{
                boxShadow: `0px 0px 10px ${theme.palette.background.shadow}`,
                borderRadius: 2,
                padding: 2,
              }}
            >
              <TextField
                size="small"
                name="title"
                placeholder="Title"
                margin="dense"
                value={post.title.text}
                // disabled={buttonStatus === "sending"}
                error={post.title.error}
                onChange={post.set}
                onBlur={post.set}
                onFocus={post.set}
                inputProps={{ maxLength: 300 }}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                }}
                // onKeyDown={handleEnter}
              />
              <TextField
                size="small"
                name="content"
                placeholder="text"
                margin="dense"
                value={post.content.text}
                // disabled={buttonStatus === "sending"}
                error={post.content.error}
                onChange={post.set}
                onBlur={post.set}
                onFocus={post.set}
                inputProps={{ maxLength: 300 }}
                multiline
                minRows={3}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                }}
                // onKeyDown={handleEnter}
              />
              <Button sx={{ width: "100%", height: 10 }} text="Submit"/>
            </Box>
          </Collapse>
          {data &&
            data.posts.map((post) => {
              console.log(data.posts);
              return (
                <Box
                  key={post.id}
                  sx={{
                    background: theme.palette.background.paper,
                  }}
                ></Box>
              );
            })}
        </Box>
      </Box>
    </>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
