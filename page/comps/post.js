import AddCommentIcon from "@mui/icons-material/AddComment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import ShareIcon from "@mui/icons-material/Share";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Collapse } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDeletePostMutation, useMeQuery } from "../src/generated/graphql";
import compact from "../utils/compact";
import msToString from "../utils/msToString";
import CreateComment from "./createComment";
import { getUsernameFromID } from "./getUsernameFromID";
import TopComment from "./topComment";
import VoteArea from "./voteArea";

export default function Post({ post, theme, isSole, ...props }) {
  const [{ data: meQuery, fetching }] = useMeQuery({
    // pause: isServer,
  });

  const [, deletePost] = useDeletePostMutation();
  const [deleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commenting, setCommenting] = useState(props.commenting);
  const [hideTopComment, setHideTopComment] = useState(false);

  const router = useRouter();

  const [readableTime, setReadableTime] = useState();
  useEffect(() => {
    setReadableTime(msToString(post.createdAt));
  }, [post.createdAt]);

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    const response = await deletePost({ postID: post.id });
    if (response.error) {
      console.log(response);
    }

    setTimeout(() => setIsDeleted(true), 1000);
  };
  const username = getUsernameFromID(post.posterID);

  const handleComment = (e) => {
    e.stopPropagation();
    if (props.showTopComment) {
      if (commenting) {
        setCommenting(false);
        setTimeout(() => setHideTopComment(false), 200);
      } else {
        setHideTopComment(true);
        setTimeout(() => setCommenting(true), 200);
      }
    } else {
      setCommenting((prev) => !prev);
    }
  };

  return (
    <Collapse in={!isDeleted}>
      <Box>
        <Box
          onClick={() => {
            if (!isSole) {
              router.push(`/post/${post.id}`);
            }
          }}
          sx={{
            position: "relative",
            zIndex: 1,
            color: theme.palette.text.primary,
            background: theme.palette.background.paper,
            width: "calc(100% - 2px)",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: theme.palette.background.border,
            margin: "auto",
            borderRadius: 2,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "auto auto auto 2em",
            gridTemplateAreas: `
              "vote user"
              "vote title"
              "vote contents"
              "vote interact"`,
            "> *": { display: "flex" },
            transition: "all 0.3s",
            ":hover": {
              borderColor: theme.palette.background.focus,
              cursor: isSole ? "auto" : "pointer",
            },
            boxShadow: "0px 0px 2px 1px rgba(0,0,0,0.1)",
            paddingBottom: 0.5,
          }}
        >
          <VoteArea post={post} theme={theme} />

          <Box
            sx={{
              gridArea: "user",
              paddingTop: 1,
              paddingBottom: 0.3,
              width: "100%",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  whiteSpace: "nowrap",
                  flexShrink: 100,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                Posted by&nbsp;
              </Box>
              <Box
                component="strong"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/user/${username}`);
                }}
                sx={{
                  textDecoration: "underline",
                  transition: "background 0.15s, text-decoration 0.15s",
                  textDecorationColor: "transparent",
                  borderRadius: 1,
                  ":hover": {
                    textDecorationColor: theme.palette.text.primary,
                    background: theme.palette.background.hover,
                    cursor: "pointer",
                  },
                  overflow: "hidden",
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                {username}
              </Box>
              <Box
                sx={{
                  marginRight: "auto",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                &nbsp;{readableTime} ago
              </Box>
              <Box
                sx={{
                  marginLeft: "auto",
                  mx: 2,
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.3s",
                }}
              >
                {compact(post.viewCount)} view{post.viewCount === 1 ? "" : "s"}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              gridArea: "title",
              fontSize: 20,
              minWidth: 0,
              paddingRight: 1,
            }}
          >
            <Box
              style={{
                overflowWrap: "break-word",
                minWidth: 0,
                fontWeight: 600,
              }}
            >
              {post.title}
            </Box>
          </Box>
          <Box sx={{ gridArea: "contents", marginRight: 1 }}>
            {post.postType === "text" ? (
              <Box sx={{ overflowWrap: "anywhere", marginBottom: 1 }}>
                {post.content}
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  marginTop: 1,
                  marginBottom: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <img
                  src={post.content}
                  alt="failed to load"
                  width="100%"
                  style={{
                    height: "100%",
                    marginBottom: -4,
                  }}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              gridArea: "interact",
              display: "flex",
              flexDirection: "row",
              marginLeft: "auto",
              marginRight: 1,
            }}
          >
            <LoadingButton
              loading={false}
              onClick={handleComment}
              startIcon={
                <AddCommentIcon
                  style={{
                    marginRight: -8,
                    transition: "all 0.3s",
                    color: theme.palette.primary.main,
                  }}
                />
              }
              sx={{
                marginLeft: -0.8,
                color: theme.palette.text.primary,
                transition: "all 0.3s",
                fontSize: props.displaySize === "xs" ? 0 : 11,
                height: 30,
                lineHeight: 30,
                textAlign: "center",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: theme.palette.background.focus,
                marginLeft: 0.7,
                minWidth: 50,
              }}
            >
              &nbsp;Comment
            </LoadingButton>
            {meQuery?.me?.id === post.posterID || meQuery?.me?.isAdmin ? (
              <>
                <LoadingButton
                  loading={deleting}
                  startIcon={
                    <DeleteIcon
                      style={{
                        color: theme.palette.text.accent,
                        marginRight: -10,
                        transition: "all 0.3s",
                      }}
                    />
                  }
                  onClick={handleDeletePost}
                  sx={{
                    transition: "all 0.3s",
                    color: theme.palette.text.primary,
                    transition: "all 0.3s",
                    fontSize: props.displaySize === "xs" ? 0 : 11,
                    height: 30,
                    lineHeight: 30,
                    textAlign: "center",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: theme.palette.background.focus,
                    marginLeft: 0.7,
                    minWidth: 50,
                  }}
                >
                  &nbsp;delete
                </LoadingButton>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  startIcon={
                    <EditIcon
                      style={{
                        marginRight: -10,
                        transition: "all 0.3s",
                        color: theme.palette.primary.main,
                      }}
                    />
                  }
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "all 0.3s",
                    fontSize: props.displaySize === "xs" ? 0 : 11,
                    height: 30,
                    lineHeight: 30,
                    textAlign: "center",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: theme.palette.background.focus,
                    marginLeft: 0.7,
                    minWidth: 50,
                  }}
                >
                  &nbsp;edit
                </Button>
              </>
            ) : (
              <Button
                startIcon={
                  <FlagIcon
                    style={{
                      marginRight: -9,
                      transition: "all 0.3s",
                      color: theme.palette.primary.main,
                    }}
                  />
                }
                sx={{
                  marginLeft: 0,
                  color: theme.palette.text.primary,
                  transition: "all 0.3s",
                  fontSize: props.displaySize === "xs" ? 0 : 11,
                  height: 30,
                  lineHeight: 30,
                  textAlign: "center",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: theme.palette.background.focus,
                  marginLeft: 0.7,
                  minWidth: 50,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                &nbsp;report
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              startIcon={
                <ShareIcon
                  style={{
                    marginRight: -9,
                    transition: "all 0.3s",
                    color: theme.palette.primary.main,
                  }}
                />
              }
              sx={{
                color: theme.palette.text.primary,
                transition: "all 0.3s",
                fontSize: props.displaySize === "xs" ? 0 : 11,
                height: 30,
                lineHeight: 30,
                textAlign: "center",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: theme.palette.background.focus,
                marginLeft: 0.7,
                minWidth: 50,
              }}
            >
              &nbsp;share
            </Button>
          </Box>
        </Box>
        <Collapse in={props.showTopComment && !hideTopComment}>
          <TopComment
            post={post}
            theme={theme}
            style={{ position: "relative", zIndex: 0 }}
          />
        </Collapse>
        <CreateComment
          postID={post.id}
          theme={theme}
          commenting={props.commenting || commenting}
          setCommenting={setCommenting}
        />
      </Box>
    </Collapse>
  );
}
