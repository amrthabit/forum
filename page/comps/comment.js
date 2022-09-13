// // react functional component for a comment

import "@fontsource/jetbrains-mono";
import ReplyIcon from "@mui/icons-material/Reply";
import ShareIcon from "@mui/icons-material/Share";
import { LoadingButton } from "@mui/lab";
import { Box, Collapse, TextField, Typography } from "@mui/material";
import {
  useGetCommentByIdQuery,
  useMeQuery,
  useUserQuery,
  useGetCommentChildrenQuery,
} from "../src/generated/graphql";
import { useState } from "react";
import { useField } from "./useField";
import { useCreateCommentMutation } from "../src/generated/graphql";

const getUsernameFromID = (id) => {
  const [{ data: userData, fetching }] = useUserQuery({
    variables: { id },
  });
  if (userData?.user) {
    return userData.user.userID;
  }
  return "[deleted]";
};

const getChildren = (commentID) => {
  const [{ data: childrenData, fetching }] = useGetCommentChildrenQuery({
    variables: { commentID },
  });
  if (childrenData?.getCommentChildren) {
    return childrenData.getCommentChildren;
  } else {
    return [];
  }
};

export default function Comment({
  comment,
  theme,
  post,
  parentSetInteracting,
  ...props
}) {
  const [, createComment] = useCreateCommentMutation();
  const [replying, setReplying] = useState(false);
  const [sending, setSending] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [submitButtonColor, setSubmitButtonColor] = useState("primary");
  const [{ data: meQuery, fetching }] = useMeQuery();

  const [{ data: commentData, fetching: fetchingComment }] =
    useGetCommentByIdQuery({
      variables: { id: comment.id },
    });
  const username = getUsernameFromID(commentData?.comment?.commenterID);

  const reply = {
    content: useField((value) => !/[^ ]/.test(value)), // test for non-whitespace
    set: (e) => {
      reply[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || reply[e.target.name].error === true) {
        reply[e.target.name].validate(e.target.value);
      }
    },
    reset: () => {
      reply.content.set("");
      reply.content.setError(false);
    },
    validate: () => {
      return [reply.content.validate()];
    },
  };

  const handleSubmit = async () => {
    setSending(true);
    setTimeout(async () => {
      if (!meQuery?.me) {
        console.log("not logged in");
      } else if (!commentData?.comment) {
        console.log("comment not found");
      } else {
        const result = await createComment({
          rootPostID: post.id,
          parentCommentID: commentData.comment.id,
          commenterID: meQuery.me.id,
          content: reply.content.text,
        });
        if (result.error) {
          console.error(result);
        } else {
          setSubmitButtonColor("success");
          reply.reset();
          setSending(false);
          setTimeout(() => setReplying(false), 1000);
        }
      }

      setTimeout(() => setSending(false), 200);
    }, 400);
  };

  const children = getChildren(comment.id);
  console.info(children);

  return (
    <Box
      onMouseEnter={() => parentSetInteracting && parentSetInteracting(false)}
      onMouseLeave={() => setInteracting(false)}
      sx={{ marginLeft: 1, marginTop: 1 }}
    >
      <Box
        onMouseEnter={() => setInteracting(true)}
        sx={{
          display: "flex",
          flexDirection: "row",
          height: 17,
          width: "100%",
        }}
      >
        <Box
          sx={{
            fontFamily: `"JetBrains mono", Roboto, sans-serif`,
            fontSize: 12,
            transformOrigin: "top left",
            // transform: "scaleX(0.85)",
            color: theme.palette.background.default,
            background: theme.palette.text.primary,
            fontWeight: 500,
            transition: "color 0.3s, background 0.3s",
            width: "fit-content",
            paddingLeft: 0.5,
            paddingRight: 0.5,
          }}
        >
          {username}
        </Box>

        {/* <Collapse
          component={Box}
          in={interacting}
          orientation="horizontal"
          style={{ width: "100%", 
          minWidth: "100%",
            background: "blue" }}
        > */}
        <Box
          sx={{
            display: "flex",
            position: "relative",
            height: "100%",
            width: "100%",
            opacity: interacting || replying ? 1 : 0,
            transition: "opacity 0.1s",
          }}
        >
          <LoadingButton
            loading={false}
            size="small"
            startIcon={<ReplyIcon style={{ marginRight: -7, marginTop: -2 }} />}
            sx={{
              borderRadius: 0,
              marginRight: 0,
              height: replying ? 40 : 17,
              position: "relative",
              transition: `height 0.2s ease-in-out ${
                replying ? "0s" : "0.3s"
              }, background 0.3s, color 0.3s`,
              zIndex: 2,
              fontSize: 11,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              // transition: "background 0.3s, color 0.3s",
              "&:hover": {
                background: theme.palette.background.hover,
              },

              replying: {
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: theme.palette.background.border,
                borderRadius: 1,
              },
            }}
            onClick={() => {
              setReplying((prev) => !prev);
              setSubmitButtonColor("primary");
            }}
          >
            REPLY
          </LoadingButton>
          <Box
            sx={{
              zIndex: 1,
              // marginLeft: 1,
              background: theme.palette.background.default,
              borderRadius: 1,
              // width: replying ? "inherit" : 0,
              left: 20,
              transition: `right 0.3s ease-in-out ${
                replying ? "0.1s" : "0s"
              }, background 0.3s, color 0.3s`,

              right: `calc(${replying ? "0%" : "100%"})`,
              transitionDuration: "0.3s",
              height: 40,
              position: "absolute",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 60,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                name="content"
                placeholder="reply"
                size="small"
                value={reply.content.text}
                disabled={sending}
                error={reply.content.error}
                onChange={reply.set}
                onBlur={reply.set}
                onFocus={reply.set}
                inputProps={{ maxLength: 600 }}
                sx={{
                  width: "90%",
                  marginRight: 1,
                }}
                autoComplete="off"

                // onKeyDown={handleEnter}
              />

              <LoadingButton
                color={submitButtonColor}
                onClick={handleSubmit}
                disabled={
                  !/[^ ]/.test(reply.content.text) &&
                  submitButtonColor !== "success"
                }
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
          <LoadingButton
            loading={false}
            size="small"
            startIcon={
              <ShareIcon style={{ marginRight: -7, transform: "scale(0.8)" }} />
            }
            sx={{
              borderRadius: 0,
              height: 17,
              fontSize: 11,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              transition: "background 0.3s, color 0.3s",
            }}
            onClick={() => {}}
          >
            SHARE
          </LoadingButton>
        </Box>
        {/* </Collapse> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: -0.5,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "3px",
            minWidth: "3px",
            background: theme.palette.text.primary,
            transition: "background 0.3s",
            marginTop: 0,
            marginBottom: 0,
          }}
        ></Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box
            onMouseEnter={() => setInteracting(true)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              // background:'green'
            }}
          >
            {commentData?.comment && (
              <Box
                sx={{
                  margin: 1,
                  marginTop: replying ? 4 : 1,
                  color: theme.palette.text.primary,
                  transition: `color 0.3s, margin 0.3s ease-out ${
                    replying ? "0s" : "0.4s"
                  }`,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {commentData.comment.content}
              </Box>
            )}
          </Box>
          <Box sx={{ width: "100%" }}>
            {children.map((child) => (
              <Comment
                key={child.id}
                comment={child}
                post={post}
                theme={theme}
                parentSetInteracting={setInteracting}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
