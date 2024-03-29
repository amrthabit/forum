import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Vote {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  voterID!: number;

  @Field()
  @Property()
  postID!: number;

  // 1 for upvote, 0 for downvote
  // todo: convert this to TinyInt/Boolean type
  @Field()
  @Property()
  voteType!: number;
}
