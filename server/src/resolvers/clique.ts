import { EntityManager } from "@mikro-orm/postgresql";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Clique } from "../entities/Clique";
import { MyContext } from "../types";

@ObjectType()
class CliqueStatus {
  @Field()
  status: string;

  @Field()
  message: string;

  @Field(() => Clique, { nullable: true })
  clique: Clique | null;
}

@Resolver()
export class CliqueResolver {
  @Query(() => Clique, { nullable: true })
  async getCliqueByID(
    @Arg("id", () => Int)
    id: number,
    @Ctx()
    { em }: MyContext
  ) {
    return await em.findOne(Clique, { id });
  }

  @Query(() => [Clique])
  async getAllCliques(
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(Clique, {});
  }

  // TODO!: don't forget to remove this from production /// /// /// /// /// /// /// /// ///
  @Mutation(() => [Clique])
  async deleteAllCliques(@Ctx() { em }: MyContext) {
    const res = await em.find(Clique, {});
    res.map(async (clique) => {
      await em.nativeDelete(Clique, { id: clique.id });
    });
    return res;
  }

  @Mutation(() => CliqueStatus)
  async formNewClique(
    @Arg("cliqueID") newCliqueID: string,
    @Arg("description") description: string,
    @Ctx() { em }: MyContext
  ) {
    newCliqueID = newCliqueID.toLowerCase();
    const cliqueAlreadyExists = await em.findOne(Clique, {
      cliqueID: newCliqueID.toLowerCase(),
    });
    if (cliqueAlreadyExists) {
      return {
        status: "failed",
        message: `The clique ${cliqueAlreadyExists.cliqueID} already exists`,
        clique: null,
      };
    }

    // if clique doesn't exist, create it
    await (em as EntityManager)
      .createQueryBuilder(Clique)
      .getKnexQuery()
      .insert({
        // graphql changes casing
        // knex doesn't adapt
        clique_id: newCliqueID,
        description,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    const res = {
      status: "successful",
      message: "clique created successfully",
      // clique: clique as Clique,
    };
    console.log(res);
    return res;
  }
  // todo: add update clique

  @Mutation(() => Boolean)
  async deleteClique(
    @Arg("cliqueID") cliqueID: string,
    @Ctx() { em }: MyContext
  ) {
    cliqueID = cliqueID.toLowerCase();
    const clique = await em.findOne(Clique, { cliqueID: cliqueID });
    if (!clique) {
      return false;
    }
    clique.status = "deleted";
    em.persistAndFlush(clique);
    return true;
  }

  @Query(() => Clique, { nullable: true })
  async getCliqueFromCliqueID(
    @Arg("cliqueID") cliqueID: string,
    @Ctx() { em }: MyContext
  ) {
    const clique = em.findOne(Clique, { cliqueID: cliqueID });
    return clique;
  }
}
