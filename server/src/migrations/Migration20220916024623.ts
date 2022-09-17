import { Migration } from '@mikro-orm/migrations';

export class Migration20220916024623 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "comment_vote" ("id" serial primary key, "voter_id" int not null, "comment_id" int not null, "vote_type" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "comment_vote" cascade;');
  }

}
