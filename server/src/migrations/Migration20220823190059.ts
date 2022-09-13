import { Migration } from '@mikro-orm/migrations';

export class Migration20220823190059 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "posted" ("id" serial primary key, "post_id" int not null, "poster_id" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "posted" cascade;');
  }

}
