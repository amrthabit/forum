import { EntityManager } from "@mikro-orm/postgresql";
import { Comment } from "../entities/Comment";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { CommentVote } from "../entities/CommentVote";
import { MyContext } from "../types";

@Resolver()
export class CommentVoteResolver {
  @Query(() => [CommentVote])
  async getUserCommentVotes(
    @Arg("voterID", () => Int)
    voterID: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(CommentVote, { voterID });
  }

  @Query(() => [CommentVote])
  async getAllCommentVotes(
    @Ctx()
    { em }: MyContext
  ) {
    const res = await em.find(CommentVote, {});
    return res;
  }

  @Query(() => [CommentVote])
  async getCommentVotes(
    @Arg("commentID", () => Int)
    commentID: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(CommentVote, { commentID });
  }

  @Query(() => CommentVote, { nullable: true })
  async getUserVoteOnComment(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("commentID", () => Int)
    commentID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(CommentVote, { voterID, commentID });
    if (!vote) {
      return null;
    }
    return vote;
  }

  @Mutation(() => Boolean)
  async castCommentVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("commentID", () => Int)
    commentID: number,
    @Arg("voteType", () => Int)
    voteType: number,
    @Ctx()
    { em }: MyContext
  ) {
    await (em as EntityManager)
      .createQueryBuilder(CommentVote)
      .getKnexQuery()
      .insert({
        voter_id: voterID,
        comment_id: commentID,
        vote_type: voteType,
      });
    const comment = await em.findOne(Comment, { id: commentID });
    if (!comment) {
      return false;
    }
    if (voteType === 1) {
      comment.upvoteCount++;
    } else {
      comment.downvoteCount++;
    }
    await em.persistAndFlush(comment);

    return true;
  }

  @Mutation(() => Boolean)
  async changeCommentVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("commentID", () => Int)
    commentID: number,
    @Arg("voteType", () => Int)
    voteType: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(CommentVote, { voterID, commentID });
    if (!vote) {
      return false;
    }
    vote.voteType = voteType;
    await em.persistAndFlush(vote);

    const comment = await em.findOne(Comment, { id: commentID });
    if (!comment) {
      return false;
    }
    // flip vote
    if (voteType === 1) {
      comment.upvoteCount++;
      comment.downvoteCount--;
    } else {
      comment.downvoteCount++;
      comment.upvoteCount--;
    }
    await em.persistAndFlush(comment);

    return true;
  }

  @Mutation(() => Boolean)
  async removeCommentVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("commentID", () => Int)
    commentID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(CommentVote, { voterID, commentID });
    if (!vote) {
      return false;
    }

    const comment = await em.findOne(Comment, { id: commentID });
    if (!comment) {
      return false;
    }
    if (vote.voteType === 1) {
      comment.upvoteCount--;
    } else {
      comment.downvoteCount--;
    }
    await em.nativeDelete(CommentVote, { voterID, commentID });
    await em.persistAndFlush(comment);
    return true;
  }
}
