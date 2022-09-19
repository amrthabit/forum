import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { PASSWORD, USER } from "./login" ;
import { DATABASE_NAME, __prod__ } from "./constants";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { Posted } from "./entities/Posted";
import { User } from "./entities/User";
import { Vote } from "./entities/Vote";
import { CommentVote } from "./entities/CommentVote";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    glob: "!(*.d).{js,ts}", // match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post, User, Posted, Vote, Comment, CommentVote],
  allowGlobalContext: true,
  dbName: DATABASE_NAME,
  debug: !__prod__,
  type: "postgresql",
  user: USER,
  password: PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
