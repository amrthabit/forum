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

@ObjectType()
class LoginStatus {
  @Field()
  status: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() { em }: MyContext) {
    return em.find(User, {});
  }

  // TODO!: don't forget to remove this from production
  @Mutation(() => [User])
  async deleteAllUsers(@Ctx() { em }: MyContext) {
    const res = await em.find(User, {});
    res.map(async (user) => {
      await em.nativeDelete(User, { id: user.id });
    });
    return res;
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext) {
    return em.findOne(User, { id });
  }

  @Mutation(() => LoginStatus)
  async register(
    @Arg("userID") newUserID: string,
    @Arg("password") newUserPassword: string,
    @Arg("firstName") newUserFirstName: string,
    @Arg("lastName") newUserLastName: string,
    @Ctx() { em }: MyContext
  ) {
    const user = await em.findOne(User, { userID: newUserID });
    if (user != null) {
      return {
        status: "failed",
        message: "user already exists",
      };
    }
    // if user doesn't exist, create it
    const hashedPassword = await argon2.hash(newUserPassword);
    const newUser = em.create(User, {
      userID: newUserID,
      password: hashedPassword,
      firstName: newUserFirstName,
      lastName: newUserLastName
    });
    await em.persistAndFlush(newUser);
    return {
      status: "successful",
      message: "user created successfully",
    };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("userID") userID: string,
    @Arg("newUserID") newUserID: string,
    @Arg("newUserPassword") newUserPassword: string,
    @Ctx() { em }: MyContext
  ) {
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
    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return false;
    }
    await em.nativeDelete(User, { userID: userID });
    return true;
  }

  @Query(() => LoginStatus)
  async login(
    @Arg("userID") userID: string,
    @Arg("userPassword") userPassword: string,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return {
        status: "failed",
        message: "user does not exist",
      };
    }
    if (!(await argon2.verify(user.password, userPassword))) {
      return {
        status: "failed",
        message: "password incorrect",
      };
    }

    req.session.userID = userID;

    return {
      status: "successful",
      message: "login successful",
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
}
