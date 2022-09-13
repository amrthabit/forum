import { EntityManager } from "@mikro-orm/postgresql";
import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Vote } from "../entities/Vote";
import { MyContext } from "../types";

@Resolver()
export class VoteResolver {
  @Query(() => [Vote])
  async getUserVotes(
    @Arg("voterID", () => Int)
    voterID: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(Vote, { voterID });
  }

  @Query(() => [Vote])
  async getAllVotes(
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(Vote, {});
  }

  @Query(() => [Vote])
  async getPostVotes(
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(Vote, { postID });
  }

  @Query(() => Vote, { nullable: true })
  async getUserVoteOnPost(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(Vote, { voterID, postID });
    console.log(vote, "is the vote");
    if (!vote) {
      return null;
    }
    return vote;
  }

  @Mutation(() => Boolean)
  async castVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("postID", () => Int)
    postID: number,
    @Arg("voteType", () => Int)
    voteType: number,
    @Ctx()
    { em }: MyContext
  ) {
    await (em as EntityManager).createQueryBuilder(Vote).getKnexQuery().insert({
      voter_id: voterID,
      post_id: postID,
      vote_type: voteType,
    });
    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return false;
    }
    if (voteType === 1) {
      post.upvoteCount++;
    } else {
      post.downvoteCount++;
    }
    await em.persistAndFlush(post);

    return true;
  }

  @Mutation(() => Boolean)
  async changeVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("postID", () => Int)
    postID: number,
    @Arg("voteType", () => Int)
    voteType: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(Vote, { voterID, postID });
    console.log(vote, "is the vote");
    console.log("new vote type", voteType);
    if (!vote) { 
      return false;
    } 
    vote.voteType = voteType;
    console.log(vote, "===> is the updated vote");
    await em.persistAndFlush(vote);

    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return false;
    }
    // flip vote
    if (voteType === 1) {
      post.upvoteCount++;
      post.downvoteCount--;
    } else {
      post.downvoteCount++;
      post.upvoteCount--;
    }
    await em.persistAndFlush(post);

    return true;
  }

  @Mutation(() => Boolean)
  async removeVote(
    @Arg("voterID", () => Int)
    voterID: number,
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const vote = await em.findOne(Vote, { voterID, postID });
    if (!vote) {
      return false;
    }

    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return false;
    }
    if (vote.voteType === 1) {
      post.upvoteCount--;
    } else {
      post.downvoteCount--;
    }
    await em.nativeDelete(Vote, { voterID, postID });
    await em.persistAndFlush(post);
    return true;
  }
}
