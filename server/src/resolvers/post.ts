import { EntityManager } from "@mikro-orm/postgresql";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async getPosts(@Ctx() { em }: MyContext) {
    return await em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    return await em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Arg("posterID") posterID: number,
    @Ctx() { em }: MyContext
  ) {   
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
    await em.nativeDelete(Post, { id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllPosts(@Ctx() { em }: MyContext) {
    await em.nativeDelete(Post, {});
    return true;
  }
}
