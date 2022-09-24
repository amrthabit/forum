import "@fontsource/jetbrains-mono";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Collapse, TextField } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  useCreateCommentMutation,
  useGetCommentByIdQuery,
  useGetCommentChildrenQuery,
  useMeQuery,
  useUserQuery,
} from "../src/generated/graphql";
import CommentVoteArea from "./commentVoteArea";
import SquareButton from "./squareButton";
import { useField } from "./useField";

// override default MUI textfield styles
const StyledTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        transition: "all 0.3s",
        borderRadius: `0px`,
        borderWidth: `1px`,
        height: 43,
        "&:active": {
          borderWidth: `1px`,
        },
      },
      "&.Mui-focused fieldset": {
        borderWidth: `1px`,
      },
      Width: "4px",
    },
  },
})(TextField);

function Comment({ comment, theme, post, parentSetInteracting, ...props }) {
  const router = useRouter();
  const [, createComment] = useCreateCommentMutation();
  const [replying, setReplying] = useState(false);
  const [sending, setSending] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [submitButtonColor, setSubmitButtonColor] = useState("primary");
  const [{ data: meQuery }] = useMeQuery();

  const [{ data: commentData, fetching: fetchingComment }] =
    useGetCommentByIdQuery({
      variables: { id: comment.id },
    });

  const [{ data: childrenData }] = useGetCommentChildrenQuery({
    variables: { commentID: comment.id || -1 },
  });

  const [{ data: userData }] = useUserQuery({
    variables: { id: commentData?.comment?.commenterID || -1 },
  });

  const username = userData?.user?.userID || "[deleted]";
  const myUsername = meQuery?.me?.userID;
  const isMyComment = username === myUsername;

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
  // TODO!: refactor
  // this useMemo prevents grandchildren from rerendering
  // direct children still rerender with parent // todo: fix
  return useMemo(() => {
    return (
      <Collapse in={!fetchingComment && !!commentData?.comment}>
        <Box
          onMouseEnter={() =>
            parentSetInteracting && parentSetInteracting(false)
          }
          onMouseLeave={() => setInteracting(false)}
          sx={{
            marginLeft: "8px",
            marginTop: "8px",
            marginBottom: "1.5px",
            marginRight: "2px",
            borderRadius: "4px",
            overflow: "hidden",
            transition: "all 0.3s",
            background: theme.palette.background.paper,
            ...(interacting && {
              transition: "all 0.1s",
              background: theme.palette.background.myCommentArea,
            }),
            boxShadow: "0px 0px 3px 0px" + theme.palette.background.shadow,
          }}
        >
          <Box
            onMouseEnter={() => setInteracting(true)}
            sx={{
              display: "flex",
              flexDirection: "row",
              height: replying ? 40 : 17,
              width: "100%",
              transition: `all 0.1s ease-in-out ${replying ? 0 : 0.3}s`,
            }}
          >
            <SquareButton
              theme={theme}
              loading={false}
              onClick={() => {
                router.push(`/user/${username}`);
              }}
              replying={replying}
              sx={{
                zIndex: 1,

                fontFamily: `"JetBrains mono", Roboto, sans-serif`,
                fontSize: 12,
                color: isMyComment
                  ? theme.other.palette.primary.main
                  : theme.palette.background.default,
                background: theme.palette.text.primary,
                fontWeight: 500,
                paddingLeft: 1,
                paddingRight: 1,
                height: replying ? 40 : 17,
                borderColor: theme.palette.text.primary,
                textAlign: "center",
                lineHeight: replying ? "39px" : "17px",
                "&:hover": {
                  background: theme.other.palette.background.focus,
                  transition: "all 0.15s",
                },
                "&:active": {
                  transition: "all 0s",
                  background: theme.other.palette.background.active,
                },
                opacity: 1,
                borderTopLeftRadius: 4,
              }}
            >
              {username}
            </SquareButton>
            <Box
              sx={{
                display: "flex",
                position: "relative",
                height: "100%",
                width: "100%",
                transition: "opacity 0.1s",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  borderBottomRightRadius: 4,
                  boxShadow: replying
                    ? ""
                    : "0px 0px 1px 0px" + theme.palette.background.shadow,
                  overflow: "hidden",
                }}
              >
                <CommentVoteArea
                  comment={comment}
                  theme={theme}
                  replying={replying}
                  interacting={interacting}
                />
                <Box
                  sx={{
                    display: "flex",
                    width: interacting ? 100 : replying ? 50 : 0,
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}
                >
                  <Box sx={{ width: 50 }}>
                    <LoadingButton
                      loading={false}
                      disableRipple
                      sx={{
                        marginLeft: replying ? (interacting ? -0.75 : -0.5) : 0,
                        zIndex: 10,
                        borderRadius: 0,
                        width: 50,
                        minWidth: 0,
                        height: replying ? 40 : 17,
                        transition: `height 0.1s ease-in-out ${
                          replying ? "0s" : "0.3s"
                        }, background 0.3s, color 0.3s, border 0.3s, border-color 0.3s, opacity 0.1s`,
                        zIndex: 12,
                        fontSize: 11,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: `1px solid ${
                          replying
                            ? theme.palette.text.primary
                            : theme.palette.background.default
                        }`,
                        "&:hover": {
                          transition: `height 0.1s ease-in-out ${
                            replying ? "0s" : "0.3s"
                          }, background 0.15s, border 0.1s`,
                          background: theme.palette.background.hover,
                          border: `1px solid ${theme.palette.text.primary}`,
                        },
                        "&:active": {
                          transition: `height 0.1s ease-in-out ${
                            replying ? "0s" : "0.3s"
                          }, background 0s`,
                          background: theme.palette.background.active,
                        },

                        opacity: interacting || replying ? 1 : 0,
                        position: "absolute",
                      }}
                      onClick={() => {
                        setReplying((prev) => !prev);
                        setSubmitButtonColor("primary");
                      }}
                    >
                      REPLY
                    </LoadingButton>
                  </Box>
                  <Box
                    sx={{
                      zIndex: 1,
                      background: theme.palette.background.default,
                      left: 51,
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
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <StyledTextField
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
                          marginRight: 0.1,
                        }}
                        autoComplete="off"
                      />

                      <Button
                        color={submitButtonColor}
                        onClick={handleSubmit}
                        disabled={
                          sending ||
                          (!/[^ ]/.test(reply.content.text) &&
                            submitButtonColor !== "success")
                        }
                        sx={{
                          width: 80,
                          borderStyle: "solid",
                          borderWidth: 1,
                          borderRadius: 0,
                          borderTopRightRadius: 4,
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: replying ? 0 : 50,
                      height: replying ? 40 : 17,
                      transition: `height 0.2s ease-in-out ${
                        replying ? "0s" : "0.3s"
                      }, width 0.3s`,
                      display: "flex",
                      flexDirection: "row",
                      overflow: "hidden",
                    }}
                  >
                    <SquareButton
                      theme={theme}
                      loading={false}
                      replying={replying}
                      onClick={() => {}}
                      sx={{
                        width: 50,
                        opacity: interacting || replying ? 1 : 0,
                        fontSize: 11,
                        fontWeight: 400,
                        borderBottomRightRadius: 4,
                      }}
                    >
                      SHARE
                    </SquareButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
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
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box
                onMouseEnter={() => setInteracting(true)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  transition: "background 0.3s",
                }}
              >
                {commentData?.comment && (
                  <Box
                    sx={{
                      marginLeft: 1,
                      marginTop: 0.1,
                      marginBottom: 0.2,
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
                {(childrenData?.getCommentChildren || []).map((child) => (
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
      </Collapse>
    );
  }, [
    reply.content.text,
    submitButtonColor,
    fetchingComment,
    childrenData,
    interacting,
    commentData,
    userData,
    replying,
    meQuery,
    sending,
    comment,
    theme,
  ]);
}

export default Comment;
