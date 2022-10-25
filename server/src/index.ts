import { MikroORM } from "@mikro-orm/core";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, HOST, SERVER_PORT } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { CliqueResolver } from "./resolvers/clique";
import { CommentResolver } from "./resolvers/comment";
import { CommentVoteResolver } from "./resolvers/commentVote";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { PostedResolver } from "./resolvers/posted";
import { UserResolver } from "./resolvers/user";
import { VoteResolver } from "./resolvers/vote";

const main = async () => {
  dotenv.config();
  const configurations: any = {
    production: {
      ssl: true,
      port: 443,
      hostname: HOST,
      origin: HOST,
    },
    development: {
      ssl: false,
      port: 4000,
      hostname: "http://localhost",
      origin: "http://localhost:3000",
    },
  };
  const environment = process.env.NODE_ENV || "development";
  const prod = environment === "production";
  const config = configurations[environment];

  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: config.origin,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(
    session({
      proxy: true,
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
        secure: prod,
      },
      saveUninitialized: false,
      secret: "somesecret",
      resave: true,
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
        CommentVoteResolver,
        CliqueResolver,
      ],
      validate: false,
    }),
    plugins: prod
      ? [ApolloServerPluginLandingPageDisabled()]
      : // need this to play around in graphql GUI
        [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // create HTTP or HTTPS server, per configuration
  let server;
  if (config.ssl) {
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer(
      {
        cert: fs.readFileSync(process.env.PATH_TO_CERTIFICATE as string),
        key: fs.readFileSync(process.env.PATH_TO_KEY as string),
      },
      app
    );
  } else {
    server = http.createServer(app);
  }

  server.listen(SERVER_PORT, () => {
    console.log(
      `Server started on ${
        config.hostname
      }:${config.port}\nAllowing CORS from ${config.origin}`
    );
  });
};

main();
