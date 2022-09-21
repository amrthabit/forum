import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownIconOutlined from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpIconOutlined from "@mui/icons-material/ThumbUpOutlined";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import {
  useCastVoteMutation,
  useChangeVoteMutation,
  useMeQuery,
  useGetUserVoteOnPostQuery,
  useGetPostVotesQuery,
  useRemoveVoteMutation,
} from "../src/generated/graphql";
import { LoadingButton } from "@mui/lab";
import isServer from "../utils/isServer";

export default function VoteArea({ post, theme, ...props }) {
  const [{ data: meQuery, fetching }] = useMeQuery({});
  const [{ data: userVoteQuery }] = useGetUserVoteOnPostQuery({
    variables: { voterID: meQuery?.me?.id, postID: post.id },
  });
  const [{ data: postVotesQuery }] = useGetPostVotesQuery({
    variables: { postID: post.id },
  });

  const [didUpvote, setDidUpvote] = useState(
    userVoteQuery?.getUserVoteOnPost?.voteType === 1
  );
  const [didDownvote, setDidDownvote] = useState(
    userVoteQuery?.getUserVoteOnPost?.voteType === 0
  );
  const [displayedVote, setDisplayedVote] = useState(
    post.upvoteCount - post.downvoteCount
  );

  useEffect(() => {
    setDidUpvote(userVoteQuery?.getUserVoteOnPost?.voteType === 1);
    setDidDownvote(userVoteQuery?.getUserVoteOnPost?.voteType === 0);
    setDisplayedVote(post.upvoteCount - post.downvoteCount);
  }, [userVoteQuery, post.upvoteCount, post.downvoteCount]);

  const [, castVote] = useCastVoteMutation();
  const [, removeVote] = useRemoveVoteMutation();
  const [, changeVote] = useChangeVoteMutation();
  // must be logged in to vote
  const canVote = () => {
    if (!meQuery?.me) {
      return false;
    }
    return true;
  };

  const [upvoting, setUpvoting] = useState(false);
  const [upvoteColor, setUpvoteColor] = useState("primary");
  const [downvoting, setDownvoting] = useState(false);
  const [downvoteColor, setDownvoteColor] = useState("primary");

  const handleUpvote = async (e) => {
    e.stopPropagation(); // parent element is clickable
    if (upvoting) {
      return;
    }
    setTimeout(() => setUpvoting(true), 100);

    // todo: refactor into function
    if (!canVote()) {
      setTimeout(() => {
        setUpvoteColor("error");
        setTimeout(() => {
          setUpvoteColor("primary");
          setTimeout(() => {
            setUpvoteColor("error");
            setTimeout(() => setUpvoteColor("primary"), 100);
          }, 100);
        }, 100);
      }, 500);

      setTimeout(() => {
        setUpvoting(false);
      }, 500);
      return;
    }

    setTimeout(async () => {
      // hasn't voted yet
      if (!didUpvote && !didDownvote) {
        setDidUpvote(true);
        await castVote({
          postID: post.id,
          voterID: meQuery.me.id,
          voteType: 1,
        });
        // if did upvote remove vote
      } else if (didUpvote) {
        setDidUpvote(false);
        await removeVote({ postID: post.id, voterID: meQuery.me.id });
        // if downvoted flip the vote
      } else {
        setDidUpvote(true);
        setDidDownvote(false);
        const res = await changeVote({
          postID: post.id,
          voterID: meQuery.me.id,
          voteType: 1,
        });
      }
      setUpvoting(false);
    }, 500);
  };

  const handleDownvote = async (e) => {
    e.stopPropagation();
    setTimeout(() => setDownvoting(true), 100);

    if (!canVote()) {
      setTimeout(() => {
        setDownvoteColor("error");
        setTimeout(() => {
          setDownvoteColor("primary");
          setTimeout(() => {
            setDownvoteColor("error");
            setTimeout(() => setDownvoteColor("primary"), 100);
          }, 100);
        }, 100);
      }, 500);

      setTimeout(() => {
        setDownvoting(false);
      }, 500);

      return;
    }
    // hasn't voted
    setTimeout(async () => {
      if (!didDownvote && !didUpvote) {
        setDidDownvote(true);
        await castVote({
          postID: post.id,
          voterID: meQuery.me.id,
          voteType: 0,
        });
        // if did downvote remove vote
      } else if (didDownvote) {
        setDidDownvote(false);
        await removeVote({ postID: post.id, voterID: meQuery.me.id });
        // if upvoted flip the vote
      } else {
        setDidDownvote(true);
        setDidUpvote(false);
        const res = await changeVote({
          postID: post.id,
          voterID: meQuery.me.id,
          voteType: 0,
        });
      }
      setDownvoting(false);
    }, 500);
  };

  return (
    <Box sx={{ gridArea: "vote", flexDirection: "column", padding: 1 }}>
      <LoadingButton
        loading={upvoting}
        disabled={upvoting || downvoting}
        sx={{
          zIndex: 1,
          minWidth: 30,
          width: 30,
          height: 30,
          "> *": { transition: upvoting ? "all 0.3s" : "all 0.1s" },
        }}
        onClick={handleUpvote}
      >
        {didUpvote ? (
          <ThumbUpIcon />
        ) : (
          <ThumbUpIconOutlined
            sx={{ transition: upvoting ? "all 0.3s" : "all 0.1s" }}
            color={upvoting ? "disabled" : upvoteColor}
          />
        )}
      </LoadingButton>
      <Box
        sx={{
          zIndex: 0,
          marginLeft: "auto",
          marginRight: "auto",
          height: 25,
          width: "100%",
          display: "flex",
          transition: "transform 0.3s",
          transform: `translateY(${didUpvote ? 13 : didDownvote ? -13 : 0}px)`,
          "> *": {
            transition: "all 0.3s",
            height: 25,
            width: 30,
            position: "absolute",
            textAlign: "center",
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          sx={{
            transform: `translateY(${-13}px)`,
            opacity: didUpvote ? 1 : 0,
          }}
        >
          {displayedVote + 1}
        </Box>
        <Box
          sx={{
            transform: `translateY(${0}px)`,
            opacity: didUpvote || didDownvote ? 0 : 1,
          }}
        >
          {displayedVote}
        </Box>
        <Box
          sx={{
            transform: `translateY(${13}px)`,
            opacity: didDownvote ? 1 : 0,
          }}
        >
          {displayedVote - 1}
        </Box>
      </Box>
      <LoadingButton
        loading={downvoting}
        onClick={handleDownvote}
        disabled={upvoting || downvoting}
        sx={{
          zIndex: 1,
          minWidth: 30,
          width: 30,
          height: 30,
          "> *": { transition: upvoting ? "all 0.3s" : "all 0.1s" },
        }}
      >
        {didDownvote ? (
          <ThumbDownIcon />
        ) : (
          <ThumbDownIconOutlined
            sx={{ transition: upvoting ? "all 0.3s" : "all 0.1s" }}
            color={downvoting ? "disabled" : downvoteColor}
          />
        )}
      </LoadingButton>
    </Box>
  );
}
