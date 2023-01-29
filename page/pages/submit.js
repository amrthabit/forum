import { ThemeProvider } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Box, Collapse, TextField } from "@mui/material";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState, createRef } from "react";
import { useField } from "../comps/useField";
import {
  useCreatePostedMutation,
  useCreatePostMutation,
  useMeQuery,
} from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import SquareButton from "../comps/squareButton";
import Image from "next/image";

function Submit({ currentPostType = "text", ...props }) {
  const router = useRouter();
  const [{ data: meQuery, fetching }] = useMeQuery();
  const [, createPost] = useCreatePostMutation();
  const [, createPosted] = useCreatePostedMutation();

  const theme = props.theme;

  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const post = {
    title: useField((value) => value.length < 3),
    clique: useField((value) => !/^([A-Za-z][A-Za-z_\d]+)$/.test(value)), // alphanumeric+`_` starting with letter
    content: useField(() => false),
    set: (e) => {
      post[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || post[e.target.name].error === true) {
        post[e.target.name].validate(e.target.value);
      }
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

  const imageRef = createRef();
  const [imageError, setImageError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    if (currentPostType === "image") {
      if (!imageRef.current?.naturalWidth) {
        setImageError(true);
        setSending(false);
        setErrorMessage("Please link a valid image");
        return;
      }

      // image must not be too wide
      if (imageRef.current.naturalWidth / imageRef.current.naturalHeight > 3) {
        setImageError(true);
        setSending(false);
        setErrorMessage("Image is too wide");
        return;
      }

      // image must not be too tall
      if (imageRef.current.naturalHeight / imageRef.current.naturalWidth > 2) {
        setImageError(true);
        setSending(false);
        setErrorMessage("Image is too tall");
        return;
      }
      setSending(false);
      setImageError(false);
    }

    const result = await createPost({
      title: post.title.text,
      content: post.content.text,
      posterID: meQuery.me.id,
      postType: currentPostType,
      clique: post.clique.text,
    });
    if (result.error) {
      console.error("create post error:", result);
    } else if (!result.data.createPost) {
      setErrorMessage("Clique does not exist.");
    } else {
      post.reset();
      await createPosted({
        postID: result.data.createPost.id,
        posterID: meQuery.me.id,
      });
      setTimeout(() => router.push("/"), 2000);
      setErrorMessage("Post submitted successfully. Redirecting...");
      setSuccess(true);
    }

    setTimeout(() => setSending(false), 200);
  };

  const postTypes = [
    "text",
    "image",
    // todo:
    // "video",
    // "link",
    // "poll",
    // "chat",
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box id="posts-column" sx={{ display: "flex", margin: 1, minWidth: 305 }}>
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
          <Collapse in={!meQuery?.me?.id}>
            <Box
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              you must be logged in to post
            </Box>
          </Collapse>
          <Collapse
            in={!!meQuery?.me?.id}
            sx={{
              transition: "all 0.3s",
            }}
          >
            <Box
              sx={{
                borderStyle: "solid",
                borderColor: theme.palette.background.border,
                borderWidth: 1,
                boxShadow: `0px 0px 10px ${theme.palette.background.shadow}`,
                borderRadius: 2,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s",
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
                  marginBottom: 0.5,
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
                  <p style={{ margin: "auto", whiteSpace: "nowrap" }}>
                    Post Type:
                  </p>
                </Box>
                {postTypes.map((postType) => (
                  <SquareButton
                    key={postType}
                    theme={theme}
                    onClick={() => router.push(`/submit/${postType}`)}
                    loading={false}
                    interacting={true}
                    sx={{
                      width: 100,
                      height: 30,
                      ...(postType === currentPostType && {
                        borderColor: theme.palette.primary.main,
                      }),
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    {postType.toUpperCase()}
                  </SquareButton>
                ))}
              </Box>
              <TextField
                size="small"
                name="clique"
                placeholder="clique"
                margin="dense"
                value={post.clique.text}
                error={post.clique.error}
                onChange={post.set}
                onBlur={post.set}
                onFocus={post.set}
                inputProps={{ maxLength: 300 }}
                sx={{
                  width: "100%",
                }}
              />
              <TextField
                size="small"
                name="title"
                placeholder="Title"
                margin="dense"
                value={post.title.text}
                error={post.title.error}
                onChange={post.set}
                onBlur={post.set}
                onFocus={post.set}
                inputProps={{ maxLength: 300 }}
                sx={{
                  width: "100%",
                }}
              />
              <TextField
                size="small"
                name="content"
                placeholder={currentPostType === "text" ? "text" : "URL"}
                margin="dense"
                value={post.content.text}
                error={post.content.error}
                onChange={post.set}
                onBlur={post.set}
                onFocus={post.set}
                inputProps={{ maxLength: 300 }}
                multiline
                minRows={currentPostType === "text" ? 3 : 1}
                sx={{
                  width: "100%",
                  marginBottom: 1.5,
                }}
              />
              {currentPostType === "image" && (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                    marginBottom: 1.5,
                    height:
                      currentPostType === "text" || !post.content.text
                        ? 0
                        : "auto",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={post.content.text}
                    alt="invalid url"
                    width="100%"
                    ref={imageRef}
                    style={{
                      height: "100%",
                      marginBottom: -4,
                    }}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {imageError && (
                  <Box
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: 18,
                      marginLeft: 2,
                      marginTop: 1,
                      marginBottom: 1,
                      width: "fit-content",
                    }}
                  >
                    {errorMessage}
                  </Box>
                )}
                <Box
                  sx={{
                    color: success
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    fontSize: 18,
                    marginLeft: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    width: "fit-content",
                  }}
                >
                  {errorMessage}
                </Box>
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
            </Box>
          </Collapse>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient)(Submit);
