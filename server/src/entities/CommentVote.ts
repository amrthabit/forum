import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class CommentVote {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  voterID!: number;
   
  @Field()
  @Property()
  commentID!: number;

  // 1 for upvote, 0 for downvote
  // todo: convert this to TinyInt/Boolean type
  @Field()
  @Property()
  voteType!: number;
}
