// this comp is used to display the most upvoted comment of a post
// it takes in a post object and displays the top comment

import { Box, Collapse, Typography } from "@mui/material";
import {
  useGetPostTopCommentQuery
} from "../src/generated/graphql";

export default function TopComment({ post, theme, ...props }) {
  const [{ data: getPostTopComment, fetching }] = useGetPostTopCommentQuery({
    variables: { postID: post.id },
  });
  return (
    <Collapse in={!fetching && getPostTopComment?.getPostTopComment}>
      <Box
        sx={{
          width: "calc(100% - 35px)",
          height: 25,
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
        }}
      >
        <div style={{overflow: "hidden" }}>
          <Typography>
            {getPostTopComment?.getPostTopComment?.content}
          </Typography>
        </div>
      </Box>
    </Collapse>
  );
}
