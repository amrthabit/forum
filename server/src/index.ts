import { MikroORM } from "@mikro-orm/core";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, HOST, SERVER_PORT, __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { CommentResolver } from "./resolvers/comment";
import { CommentVoteResolver } from "./resolvers/commentVote";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { PostedResolver } from "./resolvers/posted";
import { UserResolver } from "./resolvers/user";
import { VoteResolver } from "./resolvers/vote";
import fs from "fs";
import https from "https";
import http from "http";

const main = async () => {
  const configurations: any = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: "xo.amrthabit.com" },
    development: { ssl: false, port: 4000, hostname: "localhost" },
  };

  const environment = process.env.NODE_ENV || "production";
  const config = configurations[environment];

  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: HOST,
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
        secure: true,
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
      ],
      validate: false,
    }),
    // need this to play around in graphql GUI
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    plugins: [ApolloServerPluginLandingPageDisabled()],
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
    console.log("Creating HTTPS server.");
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer(
      {
        cert: fs.readFileSync(
          `C:/Program Files/win-acme.v2.1.22.1289.x64.pluggable/ssl/xo.amrthabit.com-chain.pem`
        ),
        key: fs.readFileSync(
          "C:/Program Files/win-acme.v2.1.22.1289.x64.pluggable/ssl/xo.amrthabit.com-key.pem"
        ),
      },
      app
    );
  } else {
    console.log("Creating HTTP server.");
    server = http.createServer(app);
  }

  server.listen(SERVER_PORT, () => {
    console.log(`backend server started on ${HOST}:${SERVER_PORT}`);
  });

  // const PORT = SERVER_PORT || 4000;

  // app.listen(PORT,

  //    () => {
  //   console.log(`started server on localhost:${PORT}`);
  // });
};

main();
