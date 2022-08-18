import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

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
  content?: string;

  @Field(() => User)
  @Property({ type: User})
  poster!: User;

  @Field()
  @Property()
  upvoteCount!: number;

  @Field()
  @Property()
  downvoteCount!: number;
  
  @Field()
  @Property()
  viewCount!: number;


}
