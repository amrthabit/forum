import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCastCommentVoteMutation,
  useChangeCommentVoteMutation,
  useGetCommentScoreQuery,
  useGetUserVoteOnCommentQuery,
  useMeQuery,
  useRemoveCommentVoteMutation,
} from "../src/generated/graphql";
import SquareButton from "./squareButton";

const compact = (number) =>
  Intl.NumberFormat("en-GB", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);

export default function CommentVoteArea({
  comment,
  theme,
  replying,
  ...props
}) {
  const [{ data: meQuery }] = useMeQuery();
  const [{ data: userVoteQuery }] = useGetUserVoteOnCommentQuery({
    variables: { voterID: meQuery?.me?.id || -1, commentID: comment.id },
  });

  const [{ data: commentScoreQuery }] = useGetCommentScoreQuery({
    variables: { commentID: comment.id },
  });

  // todo: refactor
  const [didUpvote, setDidUpvote] = useState(
    userVoteQuery?.getUserVoteOnComment?.voteType === 1
  );
  const [didDownvote, setDidDownvote] = useState(
    userVoteQuery?.getUserVoteOnComment?.voteType === 0
  );
  const [score, setScore] = useState(commentScoreQuery?.getCommentScore || 0);
  const [lastScore, setLastScore] = useState(null);
  const [displayedScore, setDisplayedScore] = useState(
    compact(commentScoreQuery?.getCommentScore || 0)
  );
  const [lastDisplayedScore, setLastDisplayedScore] = useState(null);
  const [changingScore, setChangingScore] = useState(false);
  useEffect(() => {
    const newScore = commentScoreQuery?.getCommentScore || 0;
    if (newScore !== score) {
      setChangingScore(true);
      setLastScore(score);
      setLastDisplayedScore(displayedScore);
      // changing score is like a trigger for css animation to start
      // kinda hacky but it works
      // todo? find pure css solution
      setTimeout(() => {
        setChangingScore(false);
      }, 10); // increasing this delays the animation
    }
    setScore(newScore);
    setDisplayedScore(compact(newScore));
  }, [commentScoreQuery]);

  useEffect(() => {
    setDidUpvote(userVoteQuery?.getUserVoteOnComment?.voteType === 1);
    setDidDownvote(userVoteQuery?.getUserVoteOnComment?.voteType === 0);
  }, [userVoteQuery]);

  const [, castVote] = useCastCommentVoteMutation();
  const [, removeVote] = useRemoveCommentVoteMutation();
  const [, changeVote] = useChangeCommentVoteMutation();
  // must be logged in to vote
  const canVote = () => {
    if (!meQuery?.me) {
      return false;
    }
    return true;
  };

  const [upvoting, setUpvoting] = useState(false);
  const [upvotingAfterEffect, setUpvotingAfterEffect] = useState(false);
  const [upvoteColor, setUpvoteColor] = useState(
    theme.palette.background.default
  );
  const [downvoting, setDownvoting] = useState(false);
  const [downvotingAfterEffect, setDownvotingAfterEffect] = useState(false);
  const [downvoteColor, setDownvoteColor] = useState("primary");
  // create function

  const handleUpvote = async (e) => {
    e.stopPropagation();
    setTimeout(() => setUpvoting(true), 100);

    if (downvoting || !canVote()) {
      setTimeout(() => {
        setUpvoteColor("#ff0000");
        setTimeout(() => {
          setUpvoteColor(theme.palette.background.default);
          setTimeout(() => {
            setUpvoteColor("#ff0000");
            setTimeout(
              () => setUpvoteColor(theme.palette.background.default),
              130
            );
          }, 130);
        }, 130);
      }, 500);

      setTimeout(() => {
        setUpvoting(false);
        setUpvotingAfterEffect(true);
        setTimeout(() => setUpvotingAfterEffect(false), 130 * 3);
      }, 500);
      return;
    }

    setTimeout(async () => {
      // hasn't voted yet
      if (!didUpvote && !didDownvote) {
        setDidUpvote(true);
        await castVote({
          commentID: comment.id,
          voterID: meQuery.me.id,
          voteType: 1,
        });
        // if did upvote remove vote
      } else if (didUpvote) {
        setDidUpvote(false);
        await removeVote({ commentID: comment.id, voterID: meQuery.me.id });
        // if downvoted flip the vote
      } else {
        setDidUpvote(true);
        setDidDownvote(false);
        const res = await changeVote({
          commentID: comment.id,
          voterID: meQuery.me.id,
          voteType: 1,
        });
        if (res.error) {
          console.error("Vote Error:", res.error);
        }
      }
      setUpvoting(false);
    }, 500);
  };

  const handleDownvote = async (e) => {
    e.stopPropagation();
    setTimeout(() => setDownvoting(true), 100);

    if (upvoting || !canVote()) {
      setTimeout(() => {
        setDownvoteColor("#ff0000");
        setTimeout(() => {
          setDownvoteColor(theme.palette.background.default);
          setTimeout(() => {
            setDownvoteColor("#ff0000");
            setTimeout(
              () => setDownvoteColor(theme.palette.background.default),
              130
            );
          }, 130);
        }, 130);
      }, 500);

      setTimeout(() => {
        setDownvoting(false);
        setDownvotingAfterEffect(true);
        setTimeout(() => setDownvotingAfterEffect(false), 130 * 3);
      }, 500);
      return;
    }
    // hasn't voted
    setTimeout(async () => {
      if (!didDownvote && !didUpvote) {
        setDidDownvote(true);
        await castVote({
          commentID: comment.id,
          voterID: meQuery.me.id,
          voteType: 0,
        });
        // if did downvote remove vote
      } else if (didDownvote) {
        setDidDownvote(false);
        await removeVote({ commentID: comment.id, voterID: meQuery.me.id });
        // if upvoted flip the vote
      } else {
        setDidDownvote(true);
        setDidUpvote(false);
        const res = await changeVote({
          commentID: comment.id,
          voterID: meQuery.me.id,
          voteType: 0,
        });
        if (res.error) {
          console.error("Vote Error:", res.error);
        }
      }
      setDownvoting(false);
    }, 500);
  };
  return (
    <>
      <Box
        sx={{
          // width: replying ? 0 : 100,
          height: replying ? 40 : 17,
          transition: `height 0.2s ease-in-out ${
            replying ? "0s" : "0.3s"
          }, width 0.3s`,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <SquareButton // upvote button
          theme={theme}
          loading={upvoting}
          replying={replying}
          interacting={props.interacting}
          voting={upvoting}
          onClick={handleUpvote}
          sx={{
            width: replying || !props.interacting ? 0 : 30,
            ...(upvotingAfterEffect && {
              background: upvoteColor,
              "&:hover, &:active": {
                background: upvoteColor,
              },
            }),
          }}
        >
          <KeyboardArrowUpIcon
            sx={{ color: didUpvote ? "#ff4000" : "inherit" }}
          />
        </SquareButton>

        <SquareButton // score container, unclickable
          theme={theme}
          loading={false}
          replying={replying}
          interacting={props.interacting}
          onClick={() => {}}
          sx={{
            color: didUpvote
              ? "#ff4000"
              : didDownvote
              ? "#af40eb"
              : theme.palette.text.primary,
            width: replying ? 0 : props.interacting ? 40 : 40,
            height: replying ? 40 : 17,
            cursor: "default",
            "&:hover, &:active": {
              background: theme.palette.background.default,
              opacity: 1,
            },
            opacity: 1,
            ...(!props.interacting && {
              background: theme.palette.background.paper,
              borderStyle: "none",
            }),
          }}
        >
          <Box // score
            sx={{
              zIndex: 0,
              marginLeft: "auto",
              marginRight: "auto",
              height: 17,
              lineHeight: 1.4,
              fontWeight: 300,
              width: "100%",
              display: "flex",
              transition: "transform 0.3s",
              "> *": {
                width: "100%",
                position: "absolute",
                textAlign: "center",
              },
              textAlign: "center",
            }}
          >
            <Box // major hack for this animation
              // todo!!: fix nexted ternary
              // todo: remove color animation, keep one color per number
              sx={{
                transition: `opacity ${
                  changingScore ? "0s" : "0.25s"
                },transform ${changingScore ? "0s" : "0.25s"},color ${
                  changingScore ? "0s" : "0s"
                }`,
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
                transition: `opacity ${
                  changingScore ? "0s" : "0.25s"
                },transform ${changingScore ? "0s" : "0.25s"},color ${
                  changingScore ? "0s" : "0s"
                }`,
                transform: `translateY(${
                  changingScore ? 0 : score < lastScore ? -10 : 10
                }px)`,
                opacity: changingScore ? 1 : 0,
              }}
            >
              {lastDisplayedScore}
            </Box>
          </Box>
        </SquareButton>
        <SquareButton // downvote button
          theme={theme}
          loading={downvoting}
          replying={replying}
          onClick={handleDownvote}
          interacting={props.interacting}
          sx={{
            width: replying || !props.interacting ? 0 : 30,
            ...(downvotingAfterEffect && {
              background: downvoteColor,
              "&:hover, &:active": {
                background: downvoteColor,
              },
            }),
          }}
        >
          <KeyboardArrowDownIcon
            sx={{ color: didDownvote ? "#af40eb" : "inherit" }}
          />
        </SquareButton>
      </Box>
    </>
  );
}
