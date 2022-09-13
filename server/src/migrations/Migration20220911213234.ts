import { Migration } from '@mikro-orm/migrations';

export class Migration20220911213234 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" text not null, "commenter_id" int not null, "upvote_count" int not null, "downvote_count" int not null, "view_count" int not null, "root_post_id" int not null, "parent_comment_id" int not null, "level" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment" cascade;');
  }

}
