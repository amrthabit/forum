import { EntityManager } from "@mikro-orm/postgresql";
import { Posted } from "../entities/Posted";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Clique } from "../entities/Clique";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getPosts(
    @Arg("sort", () => String, { nullable: true })
    sort: string,
    @Arg("clique", () => String, { nullable: true })
    rawClique: string,
    @Ctx() { em }: MyContext
  ) {
    let orderByRaw = "upvote_count - downvote_count";
    let desc = true;
    switch (sort) {
      case "new":
        orderByRaw = "created_at";
        break;
      case "old":
        orderByRaw = "created_at";
        desc = false;
        break;
      case "top":
        orderByRaw = "upvote_count - downvote_count";
        break;
      case "bottom":
        orderByRaw = "upvote_count - downvote_count";
        desc = false;
        break;
      case "views":
        orderByRaw = "view_count";
        break;
      case "comments":
        orderByRaw = "comment_count";
        break;
      case "random":
        orderByRaw = "RANDOM()";
        desc = false;
        break;
      default:
        orderByRaw = "upvote_count - downvote_count";
        break;
    }
    let clique = rawClique;
    console.log(clique);

    const res = await em.find(
      Post,
      clique ? { postClique: clique } : {}, //
      { orderBy: { [`(${orderByRaw})`]: desc ? "DESC" : "" } as any }
    );
    return res;
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    return await em.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Arg("posterID") posterID: number,
    @Arg("postType") postType: string,
    @Arg("clique", () => String, { nullable: true }) clique: string,
    @Ctx() { em }: MyContext
  ) {
    if (clique) {
      const cliqueExists = await em.findOne(Clique, { cliqueID: clique });
      if (!cliqueExists) {
        return null;
      }
    }

    const response = await (em as EntityManager)
      .createQueryBuilder(Post)
      .getKnexQuery()
      .insert({
        // graphql changes casing
        // knex doesn't adapt
        title,
        content,
        poster_id: posterID,
        upvote_count: 0,
        downvote_count: 0,
        view_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        post_type: postType,
        post_clique: clique || "forum",
      })
      .returning("*");

    const post = response[0];
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("newTitle", () => String, { nullable: true }) newTitle: string,
    @Ctx() { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof newTitle === "undefined") {
      return post;
    }
    post.title = newTitle;
    em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number, @Ctx() { em }: MyContext) {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return false;
    }
    await em.nativeDelete(Posted, { postID: id });
    await em.nativeDelete(Post, { id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllPosts(@Ctx() { em }: MyContext) {
    await em.nativeDelete(Post, {});
    return true;
  }

  @Query(() => Int)
  async getPostScore(
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return 0;
    }
    return post.upvoteCount - post.downvoteCount;
  }

  @Mutation(() => Boolean)
  async viewPost(
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return false;
    }
    post.viewCount++;
    em.persistAndFlush(post);
    return true;
  }

  @Query(() => Int, { nullable: true })
  async getPostViews(
    @Arg("postID", () => Int)
    postID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const post = await em.findOne(Post, { id: postID });
    if (!post) {
      return null;
    }
    return post.viewCount;
  }
}
