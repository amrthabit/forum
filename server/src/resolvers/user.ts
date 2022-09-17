import { EntityManager } from "@mikro-orm/postgresql";
import argon2 from "argon2";
import nodemailer from "nodemailer";
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
import { v4 } from "uuid";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import { MyContext } from "../types";

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
    return await em.findOne(User, { id });
  }

  @Query(() => [User])
  async users(
    @Ctx()
    { em }: MyContext
  ) {
    return await em.find(User, {});
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
    @Arg("email") newEmail: string,
    @Arg("password") newUserPassword: string,
    @Arg("firstName") newUserFirstName: string,
    @Arg("lastName") newUserLastName: string,
    @Ctx() { em, req }: MyContext
  ) {
    newUserID = newUserID.toLowerCase();
    newEmail = newEmail.toLowerCase();
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
    const emailAlreadyExists = await em.findOne(User, {
      email: newEmail.toLowerCase(),
    });
    if (emailAlreadyExists) {
      return {
        status: "failed",
        message: `Username ${emailAlreadyExists.email} already exists`,
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
        email: newEmail,
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
    return res;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("userID")
    userID: string,

    @Arg("updatedUserID")
    updatedUserID: string,

    @Arg("updatedEmail")
    updatedEmail: string,

    // @Arg("password")
    // password: string,

    @Arg("updatedUserPassword")
    updatedUserPassword: string,

    @Ctx()
    { em }: MyContext
  ) {
    userID = userID.toLowerCase();
    updatedUserID = updatedUserID.toLowerCase();
    updatedEmail = updatedEmail.toLowerCase();

    const user = await em.findOne(User, { userID: userID });
    if (!user) {
      return null;
    }
    if (typeof updatedUserID === "undefined") {
      return user;
    }
    if (typeof updatedUserPassword === "undefined") {
      return user;
    }
    user.userID = updatedUserID;
    user.password = await argon2.hash(updatedUserPassword);
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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60
    ); // expire after 1 hour
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"XOXO" <no-reply@amrthabit.com>', // sender address
      to: user.email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "Use this link to reset your password", // plain text body
      html: `<a href="localhost:3000/reset-password/${token}">Hello world?</a>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log(nodemailer.getTestMessageUrl(info));
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
    // get client side cookie
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

  @Query(() => User, { nullable: true })
  async getUserFromUsername(
    @Arg("username") username: string,
    @Ctx() { em }: MyContext
  ) {
    const user = em.findOne(User, { userID: username });
    return user;
  }
}
