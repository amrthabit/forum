import { ArrayType, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Comment {
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
  content!: string;

  @Field()
  @Property()
  commenterID!: number;

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
  @Property()
  rootPostID!: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  parentCommentID!: number;

  @Field()
  @Property()
  level!: number;

  @Field()
  @Property()
  isDeleted!: boolean;
}
