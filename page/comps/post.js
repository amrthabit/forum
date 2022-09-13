import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import FlagIcon from "@mui/icons-material/Flag";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useDeletePostMutation,
  useMeQuery,
  useUserQuery,
} from "../src/generated/graphql";
import msToString from "../utils/msToString";
import VoteArea from "./voteArea";
import { useRouter } from "next/router";
import TopComment from "./topComment";
import CreateComment from "./createComment";

const getUsernameFromID = (id) => {
  const [{ data: userData, fetching }] = useUserQuery({
    variables: { id },
  });
  if (userData?.user) {
    return userData.user.userID;
  }
  return "[deleted]";
};

export default function Post({ post, theme, isSole, ...props }) {
  const [{ data: meQuery, fetching }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
  const [deleting, setDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commenting, setCommenting] = useState(props.commenting);
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
    setCommenting((prev) => !prev);
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
            // gap: "1em 1em",
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
          }}
        >
          <VoteArea post={post} theme={theme} />

          <Box sx={{ gridArea: "user", paddingTop: 1, paddingBottom: 0.3 }}>
            <Box>
              Posted by{" "}
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
                  margin: -0.5,
                  padding: 0.5,
                  borderRadius: 1,
                  ":hover": {
                    textDecorationColor: theme.palette.text.primary,
                    background: theme.palette.background.hover,
                    cursor: "pointer",
                  },
                }}
              >
                {username}
              </Box>{" "}
              {readableTime} ago
            </Box>
          </Box>
          <Box sx={{ gridArea: "title", fontSize: 20 }}>
            <Box>
              <strong>{post.title}</strong>
            </Box>
          </Box>
          <Box sx={{ gridArea: "contents" }}>
            <Box>{post.content}</Box>
          </Box>

          <Box
            sx={{
              gridArea: "interact",
              "> *": {
                fontSize: 11,
                height: 30,
                lineHeight: 30,
                textAlign: "center",
              },
            }}
          >
            <Button
              onClick={handleComment}
              startIcon={<AddCommentIcon style={{ marginRight: -5 }} />}
              sx={{ marginLeft: -0.8 }}
            >
              Comment
            </Button>
            {meQuery?.me?.id === post.posterID ? (
              <>
                <LoadingButton
                  loading={deleting}
                  startIcon={<DeleteIcon style={{ marginRight: -7 }} />}
                  sx={{ marginLeft: -0.8 }}
                  onClick={handleDeletePost}
                >
                  delete
                </LoadingButton>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  startIcon={<EditIcon style={{ marginRight: -5 }} />}
                >
                  edit
                </Button>
              </>
            ) : (
              <Button
                startIcon={<FlagIcon style={{ marginRight: -5 }} />}
                sx={{ marginLeft: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                report
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              startIcon={<ShareIcon style={{ marginRight: -5 }} />}
            >
              share
            </Button>
          </Box>
        </Box>
        {props.showTopComment && (
          <TopComment
            post={post}
            theme={theme}
            style={{ position: "relative", zIndex: 0 }}
          />
        )}
        <CreateComment
          postID={post.id}
          theme={theme}
          commenting={props.commenting || commenting}
        />
      </Box>
    </Collapse>
  );
}
