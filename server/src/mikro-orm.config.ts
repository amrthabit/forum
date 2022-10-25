import { MikroORM } from "@mikro-orm/core";
import dotenv from "dotenv";
import path from "path";
import { Clique } from "./entities/Clique";
import { Comment } from "./entities/Comment";
import { CommentVote } from "./entities/CommentVote";
import { Post } from "./entities/Post";
import { Posted } from "./entities/Posted";
import { User } from "./entities/User";
import { Vote } from "./entities/Vote";

dotenv.config();
const __prod__ = process.env.NODE_ENV === "production";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    glob: "!(*.d).{js,ts}", // match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post, User, Posted, Vote, Comment, CommentVote, Clique],
  allowGlobalContext: true,
  dbName: process.env.DATABASE_NAME,
  debug: !__prod__,
  type: "postgresql",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
