import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response } from 'express';
import { Session } from "express-session";


export type SessionWithUser = Session & { userID: string | {}};

export type MyRequest = Request & {
  session?: SessionWithUser;
  // auth?: { user: string; permission_id: number };
};

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
  req: MyRequest,
  res: Response
}
