import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownIconOutlined from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpIconOutlined from "@mui/icons-material/ThumbUpOutlined";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCastVoteMutation,
  useChangeVoteMutation,
  useGetPostScoreQuery,
  useGetUserVoteOnPostQuery,
  useMeQuery,
  useRemoveVoteMutation,
} from "../src/generated/graphql";

const compact = (number) =>
  Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);

export default function VoteArea({ post, theme, ...props }) {
  const [{ data: meQuery }] = useMeQuery();
  const [{ data: userVoteQuery }] = useGetUserVoteOnPostQuery({
    variables: { voterID: meQuery?.me?.id || -1, postID: post.id },
  });
  const [{ data: scoreQuery }] = useGetPostScoreQuery({
    variables: { postID: post.id },
  });

  const [didUpvote, setDidUpvote] = useState(
    userVoteQuery?.getUserVoteOnPost?.voteType === 1
  );
  const [didDownvote, setDidDownvote] = useState(
    userVoteQuery?.getUserVoteOnPost?.voteType === 0
  );
  const [score, setScore] = useState(scoreQuery?.getPostScore || 0);
  const [lastScore, setLastScore] = useState(null);
  const [displayedScore, setDisplayedScore] = useState(
    scoreQuery?.getPostScore || 0
  );
  const [lastDisplayedScore, setLastDisplayedScore] = useState(null);
  const [changingScore, setChangingScore] = useState(false);
  useEffect(() => {
    const newScore = scoreQuery?.getPostScore || 0;
    if (newScore !== score) {
      setLastScore(score);
      setLastDisplayedScore(displayedScore);
      setChangingScore(true);
      // changing score is like a trigger for css animation to start
      // kinda hacky but it works
      // todo? find pure css solution
      setTimeout(() => setChangingScore(false), 10);
    }
    setScore(newScore);
    setDisplayedScore(compact(newScore));
  }, [scoreQuery]);

  useEffect(() => {
    setDidUpvote(userVoteQuery?.getUserVoteOnPost?.voteType === 1);
    setDidDownvote(userVoteQuery?.getUserVoteOnPost?.voteType === 0);
  }, [userVoteQuery]);

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
        <Box // major hack for this animation
          // todo!!: fix nexted ternary
          // todo: remove color animation, keep one color per number
          sx={{
            transition: `opacity ${changingScore ? "0s" : "0.25s"},transform ${
              changingScore ? "0s" : "0.25s"
            },color ${changingScore ? "0s" : "0s"}`,
            transform: `translateY(${
              changingScore ? (score < lastScore ? 10 : -10) : 0
            }px)`,
            opacity: changingScore ? 0 : 1,
          }}
        >
          {displayedScore}
        </Box>
        <Box
          sx={{
            transition: `opacity ${changingScore ? "0s" : "0.25s"},transform ${
              changingScore ? "0s" : "0.25s"
            },color ${changingScore ? "0s" : "0s"}`,
            transform: `translateY(${
              changingScore ? 0 : score < lastScore ? -10 : 10
            }px)`,
            opacity: changingScore ? 1 : 0,
          }}
        >
          {lastDisplayedScore}
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
