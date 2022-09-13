import { LoadingButton } from "@mui/lab";
import { Box, Collapse, TextField } from "@mui/material";
import { useState } from "react";
import { useField } from "../comps/useField";
import { useCreateCommentMutation, useMeQuery } from "../src/generated/graphql";

export default function CreateComment({ postID, theme, ...props }) {
  const [, createComment] = useCreateCommentMutation();
  const [{ data: meQuery, fetching }] = useMeQuery();

  const [creatingPost, setCreatingPost] = useState(true);
  const [sending, setSending] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const comment = {
    content: useField((value) => !/[^ ]/.test(value)), // test for non-whitespace
    set: (e) => {
      comment[e.target.name].set(e.target.value);
      // don't create errors while typing only remove them
      if (e.type === "blur" || comment[e.target.name].error === true) {
        comment[e.target.name].validate(e.target.value);
      }
    },
    reset: () => {
      comment.content.set("");
      comment.content.setError(false);
    },
    validate: () => {
      return [comment.content.validate()];
    },
  };

  const handleSubmit = async () => {
    setSending(true);
    if (meQuery?.me) {
      const result = await createComment({
        rootPostID: postID,
        parentCommentID: -1,
        commenterID: meQuery.me.id,
        content: comment.content.text,
      });
      console.log(result);
      if (result.error) {
        console.log(result);
      } else {
        comment.reset();
        setCreatingPost(false);
      }
    } else {
      console.log("not logged in");
      setAlertMessage("You must be logged in to comment");
    }

    setTimeout(() => setSending(false), 200);
  };
  return (
    <Collapse in={props.commenting}>
      <Box
        sx={{
          width: "calc(100% - 35px)",
          height: "calc(100% - 2px)",
          background: theme.palette.background.paper,
          margin: "auto",
          borderRadius: 2,
          borderStyle: "solid",
          borderWidth: "1px",
          paddingTop: 1,
          marginTop: -1,
          borderColor: theme.palette.background.border,
          paddingLeft: 1,
          paddingRight: 1,
          transition: "all 0.3s",
          color: theme.palette.text.primary,
          whiteSpace: "nowrap",
          display: "flex",
          flexDirection: "column",
          marginBottom: 1,
        }}
      >
        <TextField
          size="small"
          name="content"
          placeholder="comment"
          margin="dense"
          value={comment.content.text}
          // disabled={buttonStatus === "sending"}
          error={comment.content.error}
          onChange={comment.set}
          onBlur={comment.set}
          onFocus={comment.set}
          inputProps={{ maxLength: 600 }}
          sx={{
            width: "100%",
          }}
          // onKeyDown={handleEnter}
        />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box>{alertMessage}</Box>
          <LoadingButton
            onClick={handleSubmit}
            disabled={!/[^ ]/.test(comment.content.text)}
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
  );
}
