import { MikroORM } from "@mikro-orm/core";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { PostedResolver } from "./resolvers/posted";
import { UserResolver } from "./resolvers/user";
import { VoteResolver } from "./resolvers/vote";
import { CommentResolver } from "./resolvers/comment";
import cookieParser from "cookie-parser";
import { CommentVoteResolver } from "./resolvers/commentVote";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
          client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        // httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "somesecret",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver,
        PostedResolver,
        VoteResolver,
        CommentResolver,
        CommentVoteResolver
      ],
      validate: false,
    }),
    // need this to play around in graphql GUI
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`started server on localhost:${PORT}`);
  });
};

main();
