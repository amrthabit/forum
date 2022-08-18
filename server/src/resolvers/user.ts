import argon2 from "argon2";
import { MyContext } from "../types";
import { User } from "../entities/User";
import {
  Resolver,
  Query,
  Ctx,
  Int,
  Arg,
  Mutation,
  ObjectType,
  Field,
} from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "../constants";

@ObjectType()
class LoginStatus {
  @Field()
  status: string;

  @Field()
  message: string;

  @Field(() => User, { nullable: true })
  user: User | null;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg("id", () => Int)
    id: number,
    @Ctx()
    { em }: MyContext
  ) {
    return em.findOne(User, { id });
  }

  @Query(() => [User])
  async users(
    @Ctx()
    { em }: MyContext
  ) {
    return em.find(User, {});
  }

  // TODO!: don't forget to remove this from production /// /// /// /// /// /// /// /// ///
  @Mutation(() => [User])
  async deleteAllUsers(@Ctx() { em }: MyContext) {
    const res = await em.find(User, {});
    res.map(async (user) => {
      await em.nativeDelete(User, { id: user.id });
    });
    return res;
  }

  @Mutation(() => LoginStatus)
  async register(
    @Arg("userID") newUserID: string,
    @Arg("password") newUserPassword: string,
    @Arg("firstName") newUserFirstName: string,
    @Arg("lastName") newUserLastName: string,
    @Ctx() { em, req }: MyContext
  ) {
    newUserID = newUserID.toLowerCase();
    const userAlreadyExists = await em.findOne(User, {
      userID: newUserID.toLowerCase(),
    });
    if (userAlreadyExists) {
      return {
        status: "failed",
        message: `Username ${userAlreadyExists.userID} already exists`,
        user: null,
      };
    }

    // if user doesn't exist, create it
    const hashedPassword = await argon2.hash(newUserPassword);
    const response = await (em as EntityManager)
      .createQueryBuilder(User)
      .getKnexQuery()
      .insert({
        // graphql changes casing
        // knex doesn't adapt
        user_id: newUserID,
        password: hashedPassword,
        first_name: newUserFirstName,
        last_name: newUserLastName,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    const user = response[0];
    // create cookie
    req.session.userID = newUserID;

    const res = {
      status: "successful",
      message: "user created successfully",
      user: user as User,
    };
    console.log(res);
    return res;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("userID")
    userID: string,

    @Arg("newUserID")
    newUserID: string,

    @Arg("newUserPassword")
    newUserPassword: string,

    @Ctx()
    { em }: MyContext
  ) {
    userID = userID.toLowerCase();
    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return null;
    }
    if (typeof newUserID === "undefined") {
      return user;
    }
    if (typeof newUserPassword === "undefined") {
      return user;
    }
    user.userID = newUserID;
    user.password = await argon2.hash(newUserPassword);
    em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("userID") userID: string, @Ctx() { em }: MyContext) {
    userID = userID.toLowerCase();
    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return false;
    }
    await em.nativeDelete(User, { userID: userID });
    return true;
  }

  @Mutation(() => LoginStatus)
  async login(
    @Arg("userID")
    userID: string,

    @Arg("userPassword")
    userPassword: string,

    @Ctx()
    { em, req }: MyContext
  ) {
    userID = userID.toLowerCase();
    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return {
        status: "failed",
        message: "That user does not exist",
        user: null,
      };
    }
    if (!(await argon2.verify(user.password, userPassword))) {
      return {
        status: "failed",
        message: "Password incorrect",
        user: null,
      };
    }

    // create cookie
    req.session.userID = userID;

    return {
      status: "successful",
      message: "login successful",
      user: user as User,
    };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userID) {
      return null;
    }
    const user = await em.findOne(User, { userID: req.session.userID });
    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res, req }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
