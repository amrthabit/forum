import { Migration } from '@mikro-orm/migrations';

export class Migration20220914212427 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null, "commenter_id" int not null, "upvote_count" int not null, "downvote_count" int not null, "view_count" int not null, "root_post_id" int not null, "parent_comment_id" int null, "level" int not null, "is_deleted" boolean not null);');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "content" text not null, "poster_id" int not null, "upvote_count" int not null, "downvote_count" int not null, "view_count" int not null);');

    this.addSql('create table "posted" ("id" serial primary key, "post_id" int not null, "poster_id" int not null);');

    this.addSql('create table "user" ("id" serial primary key, "user_id" text not null, "email" text not null, "password" text not null, "first_name" text not null, "last_name" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_user_id_unique" unique ("user_id");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "vote" ("id" serial primary key, "voter_id" int not null, "post_id" int not null, "vote_type" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "posted" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "vote" cascade;');
  }

}
