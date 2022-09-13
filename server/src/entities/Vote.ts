import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Vote {
  @Field()
  @PrimaryKey()
  @Property()
  voterID!: number;

  @Field()
  @PrimaryKey()
  @Property()
  postID!: number;

  // 1 for upvote, 0 for downvote
  // todo: convert this to TinyInt/Boolean type
  @Field()
  @Property()
  voteType!: number;
}
