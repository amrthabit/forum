import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Posted {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  postID!: number;

  @Field()
  @Property()
  posterID!: number;
  
}
