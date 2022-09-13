import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Box, Collapse, TextField } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";
import MenuButton from "../comps/menuButton";
import { useField } from "../comps/useField";
import {
  useCreatePostMutation,
  useMeQuery,
  useCreatePostedMutation,
} from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Submit(props) {
  const router = useRouter();
  const [{ data: meQuery, fetching }] = useMeQuery({
    // pause: isServer,
  });
  // console.log(fetching);
  // console.log(meQuery);
  const [, createPost] = useCreatePostMutation();
  const [, createPosted] = useCreatePostedMutation();

  const theme = props.theme;

  const [creatingPost, setCreatingPost] = useState(true);
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

  const handleSubmit = async () => {
    setSending(true);

    const result = await createPost({
      title: post.title.text,
      content: post.content.text,
      posterID: meQuery.me.id,
    });
    console.log(result);
    if (result.error) {
      console.log(result);
    } else {
      post.reset();
      await createPosted({
        postID: result.data.createPost.id,
        posterID: meQuery.me.id,
      });
      setTimeout(() => router.push("/"), 200);
    }

    setTimeout(() => setSending(false), 200);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box id="posts-column" sx={{ display: "flex", margin: 1 }}>
        <Box
          sx={{
            margin: "auto",
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
          <Collapse in={creatingPost && !meQuery?.me?.id}>
            <Box
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              you must be logged in to post
            </Box>
          </Collapse>
          <Collapse
            in={creatingPost && !!meQuery?.me?.id}
            sx={{
              transition: "all 0.3s",
            }}
          >
            <Box
              sx={{
                boxShadow: `0px 0px 10px ${theme.palette.background.shadow}`,
                borderRadius: 2,
                padding: 2,
                display: "flex",
                flexDirection: "column",
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
                }}
                // onKeyDown={handleEnter}
              />
              <LoadingButton
                onClick={handleSubmit}
                disabled={post.title.text.length < 3}
                loading={sending}
                loadingPosition="end"
                endIcon={<></>}
                sx={{
                  width: 130,
                  marginLeft: "auto",
                  borderStyle: "solid",
                  borderWidth: 1,
                }}
              >
                Submit
              </LoadingButton>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Submit);
