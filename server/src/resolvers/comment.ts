import { EntityManager } from "@mikro-orm/postgresql";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Comment } from "../entities/Comment";
import { MyContext } from "../types";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  async comments(@Ctx() { em }: MyContext) {
    return await em.find(Comment, {});
  }

  @Query(() => Comment, { nullable: true })
  async comment(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    return await em.findOne(Comment, { id });
  }

  // get most upvoted comment
  @Query(() => Comment, { nullable: true })
  async getPostTopComment(
    @Arg("postID") postID: number,
    @Ctx() { em }: MyContext
  ) {
    const comments = await em.find(Comment, { rootPostID: postID });
    if (comments.length === 0) {
      return null;
    }
    let topComment = comments[0];
    for (let i = 1; i < comments.length; i++) {
      if (
        comments[i].upvoteCount - comments[i].downvoteCount >
        topComment.upvoteCount - topComment.downvoteCount
      ) {
        topComment = comments[i];
      }
    }
    return topComment;
  }

  @Query(() => [Comment])
  async getPostTopLevelComments(
    @Arg("postID") postID: number,
    @Ctx() { em }: MyContext
  ) {
    return await em.find(Comment, { rootPostID: postID, level: 0 });
  }

  @Query(() => [Comment])
  async getCommentChildren(
    @Arg("commentID") commentID: number,
    @Ctx() { em }: MyContext
  ) {
    return await em.find(Comment, { parentCommentID: commentID });
  }

  @Mutation(() => Comment)
  async createComment(
    @Arg("content") content: string,
    @Arg("commenterID") commenterID: number,
    @Arg("parentCommentID", () => Int)
    parentCommentID: number,
    @Arg("rootPostID") rootPostID: number,
    @Ctx() { em }: MyContext
  ) {
    let level = 0;
    if (parentCommentID !== -1) {
      const parentComment = await em.findOne(Comment, { id: parentCommentID });
      if (parentComment) {
        level = parentComment.level + 1;
      }
    }
    const response = await (em as EntityManager)
      .createQueryBuilder(Comment)
      .getKnexQuery()
      .insert({
        // graphql changes casing
        // knex doesn't adapt
        content,
        commenter_id: commenterID,
        upvote_count: 0,
        downvote_count: 0,
        view_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        root_post_id: rootPostID,
        parent_comment_id: parentCommentID,
        level,
        is_deleted: false,
      })
      .returning("*");

    const comment = response[0];
    return comment;
  }

  // @Mutation(() => Comment, { nullable: true })
  // async updateComment(
  //   @Arg("id") id: number,
  //   @Arg("newTitle", () => String, { nullable: true }) newTitle: string,
  //   @Ctx() { em }: MyContext
  // ) {
  //   const comment = await em.findOne(Comment, { id });
  //   if (!comment) {
  //     return null;
  //   }
  //   if (typeof newTitle === "undefined") {
  //     return comment;
  //   }
  //   em.persistAndFlush(comment);
  //   return comment;
  // }

  @Mutation(() => Boolean)
  async deleteComment(@Arg("id") id: number, @Ctx() { em }: MyContext) {
    const comment = await em.findOne(Comment, { id });
    if (!comment) {
      return false;
    }
    await em.nativeDelete(Comment, { id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllComments(@Ctx() { em }: MyContext) {
    await em.nativeDelete(Comment, {});
    return true;
  }

  @Query(() => Int)
  async getCommentScore(
    @Arg("commentID", () => Int)
    commentID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const comment = await em.findOne(Comment, { id: commentID });
    if (!comment) {
      return 0;
    }
    return comment.upvoteCount - comment.downvoteCount;
  }
}
