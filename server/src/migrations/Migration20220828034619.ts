import { Migration } from '@mikro-orm/migrations';

export class Migration20220828034619 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "vote" ("voter_id" int not null, "post_id" int not null, "vote_type" int not null, constraint "vote_pkey" primary key ("voter_id", "post_id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "vote" cascade;');
  }

}
