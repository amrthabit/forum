import { EntityManager } from "@mikro-orm/postgresql";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { Posted } from "../entities/Posted";
import { MyContext } from "../types";

@Resolver()
export class PostedResolver {
  @Query(() => Posted, { nullable: true })
  async posted(
    @Arg("id", () => Int)
    id: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.findOne(Posted, { id });
  }

  @Query(() => [Posted])
  async posteds(
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(Posted, {});
  }

  @Query(() => [Post])
  async getUserPosteds(
    @Arg("posterID", () => Int)
    posterID: number,
    @Ctx()
    { em }: MyContext
  ) {
    const posteds = await em.find(Posted, { posterID });
    const res = await Promise.all(
      posteds.map(
        async (posted) => await em.find(Post, { id: posted.postID } as any)
      )
    );
    return res.map((e) => e[0]);
  }

  // TODO!: don't forget to remove this from production /// /// /// /// /// /// /// /// ///
  @Mutation(() => [Posted])
  async deleteAllPosteds(@Ctx() { em }: MyContext) {
    const res = await em.find(Posted, {});
    res.map(async (posted) => {
      await em.nativeDelete(Posted, { id: posted.id });
    });
    return res;
  }

  @Mutation(() => Boolean)
  async createPosted(
    @Arg("posterID") posterID: number,
    @Arg("postID") postID: number,
    @Ctx() { em }: MyContext
  ) {
    const response = await (em as EntityManager)
      .createQueryBuilder(Posted)
      .getKnexQuery()
      .insert({
        // graphql changes casing
        // knex doesn't adapt
        poster_id: posterID,
        post_id: postID,
      })
      .returning("*");

    if (!response) {
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deletePosted(
    @Arg("postedID") postedID: number,
    @Ctx() { em }: MyContext
  ) {
    const posted = await em.findOne(Posted, { id: postedID });
    if (!posted) {
      return false;
    }
    await em.nativeDelete(Posted, { id: postedID });
    return true;
  }
}
