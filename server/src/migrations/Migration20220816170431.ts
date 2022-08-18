import { Migration } from '@mikro-orm/migrations';

export class Migration20220816170431 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "content" text not null, add column "upvote_count" int not null, add column "downvote_count" int not null, add column "view_count" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "content";');
    this.addSql('alter table "post" drop column "upvote_count";');
    this.addSql('alter table "post" drop column "downvote_count";');
    this.addSql('alter table "post" drop column "view_count";');
  }

}
