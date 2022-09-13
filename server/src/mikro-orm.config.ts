import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { PASSWORD, USER } from "../login";
import { __prod__ } from "./constants";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { Posted } from "./entities/Posted";
import { User } from "./entities/User";
import { Vote } from "./entities/Vote";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    glob: "!(*.d).{js,ts}", // match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post, User, Posted, Vote, Comment],
  allowGlobalContext: true,
  dbName: "xodb",
  debug: !__prod__,
  type: "postgresql",
  user: USER,
  password: PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
