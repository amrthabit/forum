import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
  },
  entities: [Post, User],
  allowGlobalContext: true,
  dbName: 'xodb',
  debug: !__prod__,
  type: "postgresql",
  user: 'stabn',
  password: '9823'
} as Parameters<typeof MikroORM.init>[0];