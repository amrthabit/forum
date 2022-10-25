import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Clique {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  cliqueID!: string;

  @Field()
  @Property({ type: "text" })
  description: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  // todo: impletent, inviteOnly, closed, deleted
  @Field(() => String)
  @Property({type: "text", default: "open"})
  status: string;
}
