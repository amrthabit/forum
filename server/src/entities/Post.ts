import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field()
  @Property({ type: "text" })
  content!: string;

  @Field()
  @Property()
  posterID!: number;

  @Field()
  @Property()
  upvoteCount!: number;

  @Field()
  @Property()
  downvoteCount!: number;

  @Field()
  @Property()
  viewCount!: number;

  @Field()
  @Property({ type: "string", default: "text" })
  postType!: string;

  @Field(() => String)
  @Property({ type: "text", default: "forum" })
  postClique: string;
}
